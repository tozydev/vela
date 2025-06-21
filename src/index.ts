import { Hono } from "hono"
import type { VelaEnv } from "./types"
import { authHandler } from "./middleware"
import { getMimeType } from "./utils"

const app = new Hono<VelaEnv>()

const ARTIFACT_PATH = "/:repo/:path{.+}"

app.use("/:repo/*", authHandler)

app.get(ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const repository = c.get("repository")
  const artifact = await repository.getArtifact(path)
  if (!artifact) {
    return c.notFound()
  }

  const headers = new Headers()
  artifact.writeHttpMetadata(headers)
  return c.body(artifact.body, { headers })
})

app.on(["POST", "PUT"], ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const repository = c.get("repository")

  const body = await c.req.blob()
  if (!body || body.size === 0) {
    return c.newResponse("No content provided", 400)
  }

  const headers = new Headers(c.req.header())
  headers.set("Content-Type", getMimeType(path) || headers.get("Content-Type") || "application/octet-stream")
  await repository.putArtifact(path, body, { httpMetadata: headers })

  return c.newResponse(null, 201, {
    Location: c.req.url
  })
})

app.on("DELETE", ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const repository = c.get("repository")

  await repository.deleteArtifact(path)

  return c.newResponse(null, 204)
})

export default app
