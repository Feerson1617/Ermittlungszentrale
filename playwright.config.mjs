import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 40000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173/Ermittlungszentrale/",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm start",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        viewport: { width: 1440, height: 1000 },
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
          args: ["--no-sandbox"],
        },
      },
    },
    {
      name: "chromium-ipad",
      use: {
        ...devices["iPad (gen 7) landscape"],
        defaultBrowserType: "chromium",
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
          args: ["--no-sandbox"],
        },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 13"],
        defaultBrowserType: "chromium",
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
          args: ["--no-sandbox"],
        },
      },
    },
    ...(process.env.TEST_WEBKIT
      ? [
          {
            name: "webkit-ipad",
            use: {
              ...devices["iPad (gen 7) landscape"],
              browserName: "webkit",
            },
          },
        ]
      : []),
  ],
});
