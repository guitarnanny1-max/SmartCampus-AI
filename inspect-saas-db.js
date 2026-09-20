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

const tables = [
  "Tenant",
  "User",
  "Subscription",
  "tenant_subscriptions",
  "PlatformPlan",
  "PlatformCustomBill",
  "PlatformSettings",
  "Invoice",
  "Payment",
  "School",
];

async function main() {
  await client.connect();

  console.log("CONNECTED TO SUPABASE\n");

  for (const table of tables) {
    console.log(`===== ${table} =====`);

    const columns = await client.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position;
    `, [table]);

    if (columns.rows.length === 0) {
      console.log("TABLE NOT FOUND\n");
      continue;
    }

    for (const c of columns.rows) {
      console.log(
        `${c.column_name} | ${c.data_type} | nullable=${c.is_nullable} | default=${c.column_default ?? ""}`
      );
    }

    console.log();
  }

  await client.end();
}

main().catch(err => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
