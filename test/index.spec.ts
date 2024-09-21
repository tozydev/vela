import { env } from "cloudflare:test"
import app from "../src/index"

const ARTIFACT = {
  path: "io/github/tozydev/vela/1.0/vela-1.0.pom",
  content: "<project>...</project>",
}

const VALID_AUTH = `Basic ${btoa(env.USERNAME + ":" + env.PASSWORD)}`
const INVALID_AUTH = `Basic ${btoa("invalid:invalid")}`

describe("Public repository", () => {
  const REPO = "/releases/"
  it("should return 404 if artifact not found", async () => {
    const res = await app.request(REPO + ARTIFACT.path, {}, env)

    expect(res.status).toBe(404)
  })

  it("should deny for unauthorized POST deploy request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "POST", body: ARTIFACT.content }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized POST request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      {
        method: "POST",
        headers: { Authorization: INVALID_AUTH },
        body: ARTIFACT.content,
      },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow POST deploy request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      {
        method: "POST",
        headers: { Authorization: VALID_AUTH },
        body: ARTIFACT.content,
      },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(REPO + ARTIFACT.path)

    const getRes = await app.request(REPO + ARTIFACT.path, {}, env)
    expect(getRes.status).toBe(200)
    expect(await getRes.text()).toBe(ARTIFACT.content)
  })

  it("should allow GET request for existing artifact", async () => {
    const res = await app.request(REPO + ARTIFACT.path, {}, env)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe(ARTIFACT.content)
  })

  it("should deny for unauthorized DELETE request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "DELETE" }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized DELETE request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "DELETE", headers: { Authorization: INVALID_AUTH } },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow DELETE request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "DELETE", headers: { Authorization: VALID_AUTH } },
      env,
    )

    expect(res.status).toBe(204)

    const getRes = await app.request(REPO + ARTIFACT.path, {}, env)
    expect(getRes.status).toBe(404)
  })

  it("should deny for unauthorized PUT request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "PUT", body: ARTIFACT.content }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized PUT request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "PUT", headers: { Authorization: INVALID_AUTH }, body: ARTIFACT.content },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow PUT request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "PUT", headers: { Authorization: VALID_AUTH }, body: ARTIFACT.content },
      env,
    )

    expect(res.status).toBe(201)

    const getRes = await app.request(REPO + ARTIFACT.path, {}, env)
    expect(getRes.status).toBe(200)
    expect(await getRes.text()).toBe(ARTIFACT.content)
  })
})

describe("Private repository", () => {
  const REPO = "/private/"
  it("should deny for unauthorized GET request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, {}, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized GET request with invalid Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: INVALID_AUTH } }, env)

    expect(res.status).toBe(401)
  })

  it("should return 404 if artifact not found with valid Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: VALID_AUTH } }, env)

    expect(res.status).toBe(404)
  })

  it("should deny for unauthorized POST deploy request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "POST", body: ARTIFACT.content }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized POST request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      {
        method: "POST",
        headers: { Authorization: INVALID_AUTH },
        body: ARTIFACT.content,
      },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow POST deploy request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      {
        method: "POST",
        headers: { Authorization: VALID_AUTH },
        body: ARTIFACT.content,
      },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(REPO + ARTIFACT.path)

    const getRes = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: VALID_AUTH } }, env)
    expect(getRes.status).toBe(200)
    expect(await getRes.text()).toBe(ARTIFACT.content)
  })

  it("should allow GET request for existing artifact", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: VALID_AUTH } }, env)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe(ARTIFACT.content)
  })

  it("should deny for unauthorized DELETE request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "DELETE" }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized DELETE request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "DELETE", headers: { Authorization: INVALID_AUTH } },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow DELETE request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "DELETE", headers: { Authorization: VALID_AUTH } },
      env,
    )

    expect(res.status).toBe(204)

    const getRes = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: VALID_AUTH } }, env)
    expect(getRes.status).toBe(404)
  })

  it("should deny for unauthorized PUT request without Authorization header", async () => {
    const res = await app.request(REPO + ARTIFACT.path, { method: "PUT", body: ARTIFACT.content }, env)

    expect(res.status).toBe(401)
  })

  it("should deny for unauthorized PUT request with invalid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "PUT", headers: { Authorization: INVALID_AUTH }, body: ARTIFACT.content },
      env,
    )

    expect(res.status).toBe(401)
  })

  it("should allow PUT request with valid Authorization header", async () => {
    const res = await app.request(
      REPO + ARTIFACT.path,
      { method: "PUT", headers: { Authorization: VALID_AUTH }, body: ARTIFACT.content },
      env,
    )

    expect(res.status).toBe(201)
    expect(res.headers.get("Location")).contains(REPO + ARTIFACT.path)

    const getRes = await app.request(REPO + ARTIFACT.path, { headers: { Authorization: VALID_AUTH } }, env)
    expect(getRes.status).toBe(200)
    expect(await getRes.text()).toBe(ARTIFACT.content)
  })
})
