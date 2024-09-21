import { Context } from "hono"

export const getArtifact = async (c: Context<{ Bindings: Env }>) => {
  const storage = c.env.VELA_BUCKET
  const artifact = await storage.get(c.req.path.slice(1))
  if (!artifact) {
    return c.notFound()
  }

  const headers = new Headers()
  artifact.writeHttpMetadata(headers)
  return c.body(artifact.body, { headers })
}
