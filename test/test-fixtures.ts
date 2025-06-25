import { env } from "cloudflare:test"

export const TEST_ENV = {
  REPOSITORY_USERNAME: "admin",
  REPOSITORY_PASSWORD: "admin",
  "REPOSITORY_CUSTOM-CREDENTIAL_USERNAME": "custom",
  "REPOSITORY_CUSTOM-CREDENTIAL_PASSWORD": "custom",
  ...env
}

export const ARTIFACT_PATH = "vn/id/tozydev/vela/1.0.0/vela-1.0.0.pom"
export const ARTIFACT_CONTENT = "<project>...</project>"

export const invalidAuthHeader = `Basic ${btoa("invalid:credentials")}`
export const authHeader = `Basic ${btoa(`${TEST_ENV.REPOSITORY_USERNAME}:${TEST_ENV.REPOSITORY_PASSWORD}`)}`
export const customAuthHeader = `Basic ${btoa(`${TEST_ENV["REPOSITORY_CUSTOM-CREDENTIAL_USERNAME"]}:${TEST_ENV["REPOSITORY_CUSTOM-CREDENTIAL_PASSWORD"]}`)}`

export const publicRepositories = [
  {
    name: "shared-public",
    auth: authHeader,
    prefix: "public",
    bucket: TEST_ENV.SHARED_BUCKET
  },
  {
    name: "isolated-public",
    auth: authHeader,
    bucket: TEST_ENV.ISOLATED_PUBLIC_BUCKET
  },
  {
    name: "custom-credential",
    auth: customAuthHeader,
    prefix: "custom",
    bucket: TEST_ENV.SHARED_BUCKET
  }
]
export const privateRepositories = [
  {
    name: "shared-private",
    auth: authHeader,
    prefix: "private",
    bucket: TEST_ENV.SHARED_BUCKET
  },

  {
    name: "isolated-private",
    auth: authHeader,
    bucket: TEST_ENV.ISOLATED_PRIVATE_BUCKET
  }
]
export const testRepositories = [
  ...publicRepositories,
  ...privateRepositories
]
