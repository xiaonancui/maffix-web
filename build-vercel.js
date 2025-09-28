#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

console.log("🚀 Starting Vercel build process...");

try {
  // Set environment variables
  process.env.CI = "true";
  process.env.VERCEL = "1";
  process.env.NODE_ENV = "production";

  console.log("📦 Installing frontend dependencies...");
  execSync("npm install", {
    cwd: path.join(__dirname, "frontend"),
    stdio: "inherit",
  });

  console.log("🏗️ Building frontend...");
  execSync("npm run build", {
    cwd: path.join(__dirname, "frontend"),
    stdio: "inherit",
  });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
