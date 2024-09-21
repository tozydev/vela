import { Context } from "hono"

export const deployArtifact = async (c: Context<{ Bindings: Env }>) => {
  const path = c.req.path.slice(1)
  const storage = c.env.VELA_BUCKET
  const headers = new Headers(c.req.header())
  await storage.put(path, await c.req.blob(), { httpMetadata: headers })

  return c.newResponse(null, 201, {
    Location: c.req.url,
  })
}
