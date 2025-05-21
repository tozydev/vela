import { Hono } from "hono"
import type { VelaEnv } from "./types"
import { authHandler } from "./middleware"

const app = new Hono<VelaEnv>()

export const ARTIFACT_PATH = "/:repo/:path{.+}"

app.use("/:repo/*", authHandler)

app.get(ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const bucket = c.get("bucket")
  const artifact = await bucket.get(path)
  if (!artifact) {
    return c.notFound()
  }

  const headers = new Headers()
  artifact.writeHttpMetadata(headers)
  return c.body(artifact.body, { headers })
})

app.on(["POST", "PUT"], ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const bucket = c.get("bucket")

  const headers = new Headers(c.req.header())
  await bucket.put(path, await c.req.blob(), { httpMetadata: headers })

  return c.newResponse(null, 201, {
    Location: c.req.url
  })
})

app.on("DELETE", ARTIFACT_PATH, async (c) => {
  const path = c.req.param("path")
  const bucket = c.get("bucket")

  await bucket.delete(path)

  return c.newResponse(null, 204)
})

export default app
