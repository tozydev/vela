import { env } from "cloudflare:test"
import { Hono } from "hono"
import { getArtifact, Routes } from "../../src/routes"

const ARTIFACT_PATH = "public/vela-1.0.txt"
const EMPTY_ARTIFACT_PATH = "public/empty.txt"
const LARGE_ARTIFACT_PATH = "public/large.txt"

describe("Get artifact", () => {
  beforeAll(async () => {
    await env.VELA_BUCKET.put(ARTIFACT_PATH, "Hello, world!", { httpMetadata: { contentType: "text/plain" } })
    await env.VELA_BUCKET.put(EMPTY_ARTIFACT_PATH, "")
    await env.VELA_BUCKET.put(LARGE_ARTIFACT_PATH, "A".repeat(1024 * 1024))
  })

  const app = new Hono()
  app.get(Routes.ARTIFACT_PATH, getArtifact)

  it("should return 404 if artifact is not found", async () => {
    const res = await app.request("/public/unknown", { method: "GET" }, env)

    expect(res.status).toBe(404)
  })

  it("should return 200 if artifact is found", async () => {
    const res = await app.request(`/${ARTIFACT_PATH}`, { method: "GET" }, env)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("Hello, world!")
  })

  it("should handle empty artifact", async () => {
    const res = await app.request(`/${EMPTY_ARTIFACT_PATH}`, { method: "GET" }, env)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("")
  })

  it("should handle large artifact", async () => {
    const res = await app.request(`/${LARGE_ARTIFACT_PATH}`, { method: "GET" }, env)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("A".repeat(1024 * 1024))
  })

  afterAll(async () => {
    await env.VELA_BUCKET.delete(ARTIFACT_PATH)
    await env.VELA_BUCKET.delete(EMPTY_ARTIFACT_PATH)
    await env.VELA_BUCKET.delete(LARGE_ARTIFACT_PATH)
  })
})
