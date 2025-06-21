import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
  test: {
    globals: true,
    coverage: {
      provider: "istanbul"
    },
    poolOptions: {
      workers: {
        singleWorker: true,
        isolatedStorage: true,
        wrangler: { configPath: "./test/wrangler.jsonc" }
      }
    }
  }
})
