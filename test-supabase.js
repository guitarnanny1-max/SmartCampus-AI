const { Client } = require("pg");

const client = new Client({
  host: "aws-0-ap-southeast-2.pooler.supabase.com",
  port: 6543,
  user: "postgres.oipoaxmqyijcvjqxofav",
  password: process.env.DB_PASSWORD,
  database: "postgres",
});

client.connect()
  .then(() => client.query("select current_database(), current_user, now()"))
  .then(r => console.log("CONNECTED:", r.rows[0]))
  .catch(e => console.log("FAILED:", e.code, e.message))
  .finally(() => client.end());
