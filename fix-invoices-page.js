const fs = require("fs");
const { execSync } = require("child_process");

const filePath = "src/app/admin/invoices/page.tsx";
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Fix optional school property access
  content = content.replace(/inv\.school\.name/g, "inv.school?.name ?? 'Direct Client'");
  
  // Fix items property to match schema title if needed
  content = content.replace(/inv\.items/g, "inv.title");

  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Fixed src/app/admin/invoices/page.tsx type issues.");
} else {
  console.log("⚠️ src/app/admin/invoices/page.tsx not found.");
}

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
