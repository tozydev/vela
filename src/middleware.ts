import { createMiddleware } from "hono/factory"
import { basicAuth } from "hono/basic-auth"
import type { VelaContext } from "./types"

export const authHandler = createMiddleware(async (c: VelaContext, next) => {
  const repo = c.req.param("repo")
  if (!repo) {
    return c.notFound()
  }

  const config = c.env.REPOSITORIES.find((config) => config.name === repo)
  if (!config) {
    return c.notFound()
  }

  if (!config.private && c.req.method === "GET") {
    return next()
  }

  const bucket = c.env[config.bucket]
  if (!bucket) {
    return c.notFound()
  }

  c.set("bucket", bucket)

  const auth = basicAuth({
    verifyUser: (username, password, c: VelaContext) => username === c.env.VELA_USERNAME && password === c.env.VELA_PASSWORD
  })
  return auth(c, next)
})
