import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "tests/e2e", timeout: 30000, use: { baseURL:"http://127.0.0.1:4173", viewport:{width:1440,height:1000}, browserName:"chromium", headless:true }, webServer:{ command:"npm run dev -- --host 127.0.0.1 --port 4173", url:"http://127.0.0.1:4173", reuseExistingServer:true } });
