import { Hono } from "hono"
import { repoAccess } from "../../src/middlewares/repoAccess"
import { Routes } from "../../src/routes"

const MOCK_ENV = {
  PUBLIC_REPOSITORIES: ["public"],
  PRIVATE_REPOSITORIES: ["private"],
  USERNAME: "admin",
  PASSWORD: "admin",
}

const VALID_AUTH_HEADER = `Basic ${btoa(`${MOCK_ENV.USERNAME}:${MOCK_ENV.PASSWORD}`)}`
const INVALID_AUTH_HEADER = `Basic ${btoa("invalid:invalid")}`

describe("Repository access", () => {
  const app = new Hono()
  app.use(Routes.REPO, repoAccess)
  app.get(Routes.REPO, async (c) => c.text("OK")).post(async (c) => c.text("OK"))

  it("should return 404 if repository is not found", async () => {
    const res = await app.request("/unknown-repo/", {}, MOCK_ENV)
    expect(res.status).toBe(404)
  })

  it("should deny access if repository is private and no credentials are provided", async () => {
    const res = await app.request("/private", { method: "GET" }, MOCK_ENV)
    expect(res.status).toBe(401)
  })

  it("should deny access if method is not GET", async () => {
    const res = await app.request("/public", { method: "POST" }, MOCK_ENV)
    expect(res.status).toBe(401)
  })

  it("should allow access if repository is public", async () => {
    const res = await app.request("/public", { method: "GET" }, MOCK_ENV)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })

  it("should allow access if request is POST and credentials are provided", async () => {
    const res = await app.request(
      "/public",
      {
        method: "POST",
        headers: {
          Authorization: VALID_AUTH_HEADER,
        },
      },
      MOCK_ENV,
    )
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })

  it("should allow access if repository is private and credentials are provided", async () => {
    const res = await app.request(
      "/private",
      {
        method: "GET",
        headers: {
          Authorization: VALID_AUTH_HEADER,
        },
      },
      MOCK_ENV,
    )
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })

  it("should deny access if repository is private and credentials are invalid", async () => {
    const res = await app.request(
      "/private",
      {
        method: "GET",
        headers: {
          Authorization: INVALID_AUTH_HEADER,
        },
      },
      MOCK_ENV,
    )
    expect(res.status).toBe(401)
  })

  it("should deny access if request is POST and credentials are invalid", async () => {
    const res = await app.request(
      "/public",
      {
        method: "POST",
        headers: {
          Authorization: INVALID_AUTH_HEADER,
        },
      },
      MOCK_ENV,
    )
    expect(res.status).toBe(401)
  })

  it("should deny access if repository is private and Authorization header is missing", async () => {
    const res = await app.request("/private", { method: "GET" }, MOCK_ENV)
    expect(res.status).toBe(401)
  })

  it("should deny access if Authorization header is malformed", async () => {
    const res = await app.request(
      "/private",
      {
        method: "GET",
        headers: {
          Authorization: "MalformedHeader",
        },
      },
      MOCK_ENV,
    )
    expect(res.status).toBe(401)
  })
})
