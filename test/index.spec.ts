import { env } from "cloudflare:test"
import app from "../src"
import { describe, it } from "vitest"

const TEST_ENV = {
  REPOSITORY_USERNAME: "admin",
  REPOSITORY_PASSWORD: "admin",
  "REPOSITORY_CUSTOM-CREDENTIAL_USERNAME": "custom",
  "REPOSITORY_CUSTOM-CREDENTIAL_PASSWORD": "custom",
  ...env
}

const ARTIFACT_PATH = "vn/id/tozydev/vela/1.0.0/vela-1.0.0.pom"
const ARTIFACT_CONTENT = "<project>...</project>"

const invalidAuthHeader = `Basic ${btoa("invalid:credentials")}`
const authHeader = `Basic ${btoa(`${TEST_ENV.REPOSITORY_USERNAME}:${TEST_ENV.REPOSITORY_PASSWORD}`)}`
const customAuthHeader = `Basic ${btoa(`${TEST_ENV["REPOSITORY_CUSTOM-CREDENTIAL_USERNAME"]}:${TEST_ENV["REPOSITORY_CUSTOM-CREDENTIAL_PASSWORD"]}`)}`
const testRepositories = [
  {
    name: "shared-public",
    auth: authHeader,
    prefix: "public",
    bucket: TEST_ENV.SHARED_BUCKET
  },
  {
    name: "shared-private",
    auth: authHeader,
    prefix: "private",
    bucket: TEST_ENV.SHARED_BUCKET
  },
  {
    name: "isolated-public",
    auth: authHeader,
    bucket: TEST_ENV.ISOLATED_PUBLIC_BUCKET
  },
  {
    name: "isolated-private",
    auth: authHeader,
    bucket: TEST_ENV.ISOLATED_PRIVATE_BUCKET
  },
  {
    name: "custom-credential",
    auth: customAuthHeader,
    prefix: "custom",
    bucket: TEST_ENV.SHARED_BUCKET
  }
]

describe("Integration: API Endpoints", () => {
  describe("GET /{repository}/{artifact}", () => {
    const publicRepositories = [
      {
        name: "shared-public",
        bucket: TEST_ENV.SHARED_BUCKET,
        prefix: "public"
      },
      {
        name: "custom-credential",
        bucket: TEST_ENV.SHARED_BUCKET,
        prefix: "custom"
      },
      {
        name: "isolated-public",
        bucket: TEST_ENV.ISOLATED_PUBLIC_BUCKET
      }
    ]
    const privateRepositories = [
      {
        name: "shared-private",
        bucket: TEST_ENV.SHARED_BUCKET,
        prefix: "private"
      },
      {
        name: "isolated-private",
        bucket: TEST_ENV.ISOLATED_PRIVATE_BUCKET
      }
    ]

    publicRepositories.forEach((repo) => {
      describe(`Public Repository (${repo.name})`, () => {
        it("should return 404 for a non-existent artifact", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {}, TEST_ENV)
          expect(res.status).toBe(404)
        })

        it("should return 200 and the artifact content if it exists", async () => {
          const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH

          await repo.bucket.put(bucketPath, ARTIFACT_CONTENT, {
            httpMetadata: { contentType: "application/xml" }
          })

          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {}, TEST_ENV)

          expect(res.status).toBe(200)
          expect(res.headers.get("content-type")).toContain("application/xml")
          expect(await res.text()).toBe(ARTIFACT_CONTENT)
        })

        it("should return 404 for a request to root repository path", async () => {
          const res = await app.request(`/${repo.name}/`, {}, TEST_ENV)
          expect(res.status).toBe(404)
        })
      })
    })

    privateRepositories.forEach((repo) => {
      describe(`Private Repository (${repo.name})`, () => {
        it("should return 401 Unauthorized without authentication", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {}, TEST_ENV)
          expect(res.status).toBe(401)
        })

        it("should return 401 Unauthorized with bad credentials", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            headers: { Authorization: invalidAuthHeader }
          }, TEST_ENV)

          expect(res.status).toBe(401)
        })

        it("should return 404 for a non-existent artifact with valid auth", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            headers: { Authorization: authHeader }
          }, TEST_ENV)

          expect(res.status).toBe(404)
        })

        it("should return 200 and the artifact with valid auth", async () => {
          const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
          await repo.bucket.put(bucketPath, ARTIFACT_CONTENT, {
            httpMetadata: { contentType: "application/xml" }
          })

          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            headers: { Authorization: authHeader }
          }, TEST_ENV)

          expect(res.status).toBe(200)
          expect(await res.text()).toBe(ARTIFACT_CONTENT)
        })
      })
    })
  })

  describe("PUT & POST /{repository}/{artifact}", () => {
    const methods = ["PUT", "POST"]
    methods.forEach((method) => {
      describe(`Using ${method}`, () => {
        testRepositories.forEach((repo) => {
          const name = repo.name === "custom-credential" ? `Per-Repository Credentials (${repo.name})` : `Shared Credentials (${repo.name})`
          describe(name, () => {
            it("should return 401 when deploying without auth", async () => {
              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                method,
                body: ARTIFACT_CONTENT
              }, TEST_ENV)
              expect(res.status).toBe(401)
            })

            it("should return 401 when deploying with bad credentials", async () => {
              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                method,
                body: ARTIFACT_CONTENT,
                headers: { Authorization: invalidAuthHeader }
              }, TEST_ENV)
              expect(res.status).toBe(401)
            })

            it("should return 201 when deploy artifact with valid auth", async () => {
              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                method,
                body: ARTIFACT_CONTENT,
                headers: { Authorization: repo.auth, "Content-Type": "application/xml" }
              }, TEST_ENV)
              expect(res.status).toBe(201)

              // Verify
              const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
              const obj = await repo.bucket.get(bucketPath)
              expect(obj).not.toBeNull()
              expect(await obj?.text()).toBe(ARTIFACT_CONTENT)
              expect(obj?.httpMetadata?.contentType).toBe("application/xml")
            })

            it("should return 400 when deploying with empty body", async () => {
              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                method,
                body: "",
                headers: { Authorization: repo.auth, "Content-Type": "application/xml" }
              }, TEST_ENV)
              expect(res.status).toBe(400)
            })
          })
        })
      })
    })
  })

  describe("DELETE /{repository}/{artifact}", () => {
    testRepositories.forEach((repo) => {
      const name = repo.name === "custom-credential" ? `Per-Repository Credentials (${repo.name})` : `Shared Credentials (${repo.name})`
      describe(name, () => {
        it("should return 401 when deleting without auth", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, { method: "DELETE" }, TEST_ENV)
          expect(res.status).toBe(401)
        })

        it("should return 401 when deleting with bad credentials", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            method: "DELETE",
            headers: { Authorization: invalidAuthHeader }
          }, TEST_ENV)
          expect(res.status).toBe(401)
        })

        it("should return 204 when deleting with valid auth", async () => {
          const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
          await repo.bucket.put(bucketPath, ARTIFACT_CONTENT)

          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            method: "DELETE",
            headers: { Authorization: repo.auth }
          }, TEST_ENV)
          expect(res.status).toBe(204)

          const obj = await repo.bucket.get(bucketPath)
          expect(obj).toBeNull()
        })

        it("should return 204 when deleting an artifact that does not exist", async () => {
          const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
            method: "DELETE",
            headers: { Authorization: repo.auth }
          }, TEST_ENV)
          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe("Edge Cases", () => {
    it("should return 404 for a request to an undefined repository", async () => {
      const res = await app.request(`/non-existent-repo/${ARTIFACT_PATH}`, {}, TEST_ENV)
      expect(res.status).toBe(404)
    })

    it("should return 404 for a request without repository and path", async () => {
      const res = await app.request("", {}, TEST_ENV)
      expect(res.status).toBe(404)
    })
  })
})
