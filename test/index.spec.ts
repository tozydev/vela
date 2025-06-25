import app from "../src"
import {
  ARTIFACT_CONTENT,
  ARTIFACT_PATH,
  authHeader,
  invalidAuthHeader,
  privateRepositories,
  publicRepositories,
  TEST_ENV,
  testRepositories
} from "./test-fixtures"
import { describe } from "vitest"

describe("Integration: API Endpoints", () => {
  describe("GET & HEAD /{repository}/{artifact}", () => {
    const methods = ["GET", "HEAD"]
    methods.forEach((method) => {
      describe(`Using ${method}`, () => {
        publicRepositories.forEach((repo) => {
          describe(`Public Repository (${repo.name})`, () => {
            it("should return 404 for a non-existent artifact", async () => {
              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {}, TEST_ENV)
              expect(res.status).toBe(404)
            })

            it("should return 200 if it exists", async () => {
              const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH

              await repo.bucket.put(bucketPath, ARTIFACT_CONTENT, {
                httpMetadata: { contentType: "application/xml" }
              })

              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {}, TEST_ENV)

              expect(res.status).toBe(200)
              expect(res.headers.get("content-type")).toContain("application/xml")

              const content = await res.text()
              if (method === "GET") {
                expect(content).toBe(ARTIFACT_CONTENT)
              }
            })

            it("should return 404 for a request to root repository path", async () => {
              const res = await app.request(`/${repo.name}/`, {}, TEST_ENV)
              expect(res.status).toBe(404)
            })

            it("should return 404 with request for artifact group", async () => {
              const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
              await repo.bucket.put(bucketPath, ARTIFACT_CONTENT, {
                httpMetadata: { contentType: "application/xml" }
              })

              const res = await app.request(`/${repo.name}/vn/id/tozydev/vela/1.0.0/`, {}, TEST_ENV)
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

            it("should return 200 if exists with valid auth", async () => {
              const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
              await repo.bucket.put(bucketPath, ARTIFACT_CONTENT, {
                httpMetadata: { contentType: "application/xml" }
              })

              const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                headers: { Authorization: authHeader }
              }, TEST_ENV)

              expect(res.status).toBe(200)
              expect(res.headers.get("content-type")).toContain("application/xml")
              const content = await res.text()
              if (method === "GET") {
                expect(content).toBe(ARTIFACT_CONTENT)
              }
            })
          })
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

            if (repo.name === "custom-credential") {
              it("should return 201 when deploying with shared credentials", async () => {
                  const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
                    method,
                    body: ARTIFACT_CONTENT,
                    headers: { Authorization: authHeader, "Content-Type": "application/xml" }
                  }, TEST_ENV)
                  // noinspection DuplicatedCode
                  expect(res.status).toBe(201)

                  // Verify
                  const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
                  const obj = await repo.bucket.get(bucketPath)
                  expect(obj).not.toBeNull()
                  expect(await obj?.text()).toBe(ARTIFACT_CONTENT)
                  expect(obj?.httpMetadata?.contentType).toBe("application/xml")
                }
              )
            }
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

        if (repo.name === "custom-credential") {
          it("should return 204 when deleting with shared credentials", async () => {
            const bucketPath = repo.prefix ? `${repo.prefix}/${ARTIFACT_PATH}` : ARTIFACT_PATH
            await repo.bucket.put(bucketPath, ARTIFACT_CONTENT)

            const res = await app.request(`/${repo.name}/${ARTIFACT_PATH}`, {
              method: "DELETE",
              headers: { Authorization: authHeader }
            }, TEST_ENV)
            expect(res.status).toBe(204)

            const obj = await repo.bucket.get(bucketPath)
            expect(obj).toBeNull()
          })
        }
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
