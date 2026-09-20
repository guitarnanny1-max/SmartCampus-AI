const { Client } = require("pg");
const fs = require("fs");

function getEnv(name) {
  const line = fs.readFileSync(".env", "utf8")
    .split("\n")
    .find(line => line.startsWith(name + "="));

  if (!line) return null;

  return line
    .slice(name.length + 1)
    .trim()
    .replace(/^"(.*)"$/, "$1");
}

const client = new Client({
  connectionString: getEnv("DIRECT_URL"),
  ssl: { rejectUnauthorized: false },
});

async function query(label, sql) {
  console.log(`\n===== ${label} =====`);

  const result = await client.query(sql);

  if (result.rows.length === 0) {
    console.log("NO RECORDS");
    return;
  }

  for (const row of result.rows) {
    console.log(JSON.stringify(row));
  }
}

async function main() {
  await client.connect();
  console.log("CONNECTED TO SUPABASE");

  await query(
    "PLATFORM PLANS",
    `SELECT * FROM "PlatformPlan" ORDER BY "createdAt";`
  );

  await query(
    "TENANTS",
    `SELECT
       id,
       subdomain,
       name,
       plan,
       status,
       "paymentStatus",
       "onboardingStatus",
       "contactEmail",
       "studentCount",
       "activatedAt",
       "verifiedAt"
     FROM "Tenant"
     ORDER BY "createdAt" DESC
     LIMIT 20;`
  );

  await query(
    "SUBSCRIPTIONS",
    `SELECT * FROM "Subscription"
     ORDER BY "createdAt" DESC
     LIMIT 20;`
  );

  await query(
    "TENANT SUBSCRIPTIONS",
    `SELECT * FROM tenant_subscriptions
     ORDER BY created_at DESC
     LIMIT 20;`
  );

  await query(
    "SCHOOLS",
    `SELECT * FROM "School"
     ORDER BY "createdAt" DESC
     LIMIT 20;`
  );

  await client.end();
}

main().catch(err => {
  console.error("\nERROR:", err.message);
  process.exit(1);
});
