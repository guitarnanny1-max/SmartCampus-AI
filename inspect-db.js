const { Client } = require("pg");
const fs = require("fs");

function getEnv(name) {
  const match = fs.readFileSync(".env", "utf8")
    .split("\n")
    .find(line => line.startsWith(name + "="));

  if (!match) return null;

  return match
    .slice(name.length + 1)
    .trim()
    .replace(/^"(.*)"$/, "$1");
}

const url = getEnv("DIRECT_URL");

if (!url) {
  throw new Error("DIRECT_URL not found in .env");
}

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log("CONNECTED TO SUPABASE");

  const tables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log("\n===== PUBLIC TABLES =====");

  if (tables.rows.length === 0) {
    console.log("NO PUBLIC TABLES");
  } else {
    for (const row of tables.rows) {
      console.log(row.table_name);
    }
  }

  const migrations = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = '_prisma_migrations';
  `);

  console.log("\n===== PRISMA MIGRATIONS =====");

  if (migrations.rows.length === 0) {
    console.log("_prisma_migrations DOES NOT EXIST");
  } else {
    console.log("_prisma_migrations EXISTS");

    const rows = await client.query(`
      SELECT migration_name, finished_at, rolled_back_at
      FROM "_prisma_migrations"
      ORDER BY started_at;
    `);

    for (const row of rows) {
      console.log(JSON.stringify(row));
    }
  }

  await client.end();
}

main().catch((err) => {
  console.error("\nERROR:", err.message);
  process.exit(1);
});
