import { env } from "cloudflare:test"
import { Hono } from "hono"
import { deleteArtifact, Routes } from "../../src/routes"

const ARTIFACT_PATH = "public/vela-1.0.txt"

describe("Delete artifact", () => {
  beforeAll(async () => {
    await env.VELA_BUCKET.put(ARTIFACT_PATH, "Hello, world!")
  })

  const app = new Hono()
  app.delete(Routes.ARTIFACT_PATH, deleteArtifact)

  it("should delete artifact", async () => {
    const res = await app.request(`/${ARTIFACT_PATH}`, { method: "DELETE" }, env)

    expect(res.status).toBe(204)
    expect(await env.VELA_BUCKET.get(ARTIFACT_PATH)).toBeNull()
  })

  it("should return 204 if artifact is not found", async () => {
    const res = await app.request("/public/unknown", { method: "DELETE" }, env)

    expect(res.status).toBe(204)
  })

  afterAll(async () => {
    await env.VELA_BUCKET.delete(ARTIFACT_PATH)
  })
})
