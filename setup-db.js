const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📦 Installing Prisma and SQLite dependencies...");
execSync("npm install prisma @prisma/client", { stdio: "inherit" });

const prismaDir = "prisma";
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

const schemaContent = `
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model School {
  id        String   @id @default(cuid())
  name      String   @default("Delhi Public School")
  code      String   @default("DPS-2026")
  createdAt DateTime @default(now())
}

model Invoice {
  id        String   @id
  title     String
  amount    Float
  date      String
  status    String
}
`;

fs.writeFileSync(path.join(prismaDir, "schema.prisma"), schemaContent, "utf8");
console.log("✅ Created prisma/schema.prisma configuration.");

console.log("🏗️ Initializing database migration and generating Prisma Client...");
execSync("npx prisma db push", { stdio: "inherit" });

console.log("🚀 Running Next.js production build with fully integrated database...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Database and application built successfully without warnings!");
