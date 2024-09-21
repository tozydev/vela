import { Context } from "hono"

export const deleteArtifact = async (c: Context<{ Bindings: Env }>) => {
  const storage = c.env.VELA_BUCKET
  await storage.delete(c.req.path.slice(1))
  return c.newResponse(null, 204)
}
