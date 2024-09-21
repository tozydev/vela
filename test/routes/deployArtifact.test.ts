import { env } from "cloudflare:test"
import { Hono } from "hono"
import { deployArtifact, getArtifact, Routes } from "../../src/routes"

const ARTIFACT_PATH_1 = "public/vela-1.0.txt"
const ARTIFACT_PATH_2 = "public/vela-2.0.txt"
const EMPTY_ARTIFACT_PATH = "public/empty.txt"
const LARGE_ARTIFACT_PATH = "public/large.txt"

describe("Deploy artifact", () => {
  const app = new Hono()
  app.post(Routes.ARTIFACT_PATH, deployArtifact).put(deployArtifact)

  it("should deploy artifact with POST method", async () => {
    const res = await app.request(
      `/${ARTIFACT_PATH_1}`,
      { method: "POST", body: "Hello, world!", headers: { "Content-Type": "text/plain" } },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(ARTIFACT_PATH_1)

    const artifact = await env.VELA_BUCKET.get(ARTIFACT_PATH_1)
    expect(artifact).toBeDefined()
    expect(artifact?.httpMetadata).toBeDefined()
    expect(artifact?.httpMetadata?.contentType).toBe("text/plain")
    expect(await artifact?.text()).toBe("Hello, world!")
  })

  it("should deploy artifact with PUT method", async () => {
    const res = await app.request(
      `/${ARTIFACT_PATH_2}`,
      { method: "PUT", body: "Hello, world!", headers: { "Content-Type": "text/plain" } },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(ARTIFACT_PATH_2)

    const artifact = await env.VELA_BUCKET.get(ARTIFACT_PATH_2)
    expect(artifact).toBeDefined()
    expect(artifact?.httpMetadata).toBeDefined()
    expect(artifact?.httpMetadata?.contentType).toBe("text/plain")
    expect(await artifact?.text()).toBe("Hello, world!")
  })

  it("should deploy empty artifact", async () => {
    const res = await app.request(
      `/${EMPTY_ARTIFACT_PATH}`,
      { method: "POST", body: "", headers: { "Content-Type": "text/plain" } },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(EMPTY_ARTIFACT_PATH)

    const object = await env.VELA_BUCKET.get(EMPTY_ARTIFACT_PATH)
    expect(object).toBeDefined()
    expect(await object?.text()).toBe("")
  })

  it("should deploy large artifact", async () => {
    const size = 1024 * 1024
    const res = await app.request(
      `/${LARGE_ARTIFACT_PATH}`,
      { method: "POST", body: "A".repeat(size), headers: { "Content-Type": "text/plain" } },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(LARGE_ARTIFACT_PATH)

    const object = await env.VELA_BUCKET.head(LARGE_ARTIFACT_PATH)
    expect(object).toBeDefined()
    expect(object?.size).toBe(size)
  })

  afterAll(async () => {
    await env.VELA_BUCKET.delete(ARTIFACT_PATH_1)
    await env.VELA_BUCKET.delete(ARTIFACT_PATH_2)
    await env.VELA_BUCKET.delete(EMPTY_ARTIFACT_PATH)
    await env.VELA_BUCKET.delete(LARGE_ARTIFACT_PATH)
  })
})
