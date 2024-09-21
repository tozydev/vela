import { Context } from "hono"
import { basicAuth } from "hono/basic-auth"
import { createMiddleware } from "hono/factory"

/**
 * Middleware to check if the repository is public or private and if the request should be authenticated.
 */
export const repoAccess = createMiddleware(async (c, next) => {
  const repo = c.req.param("repo")!

  const isPublic = c.env.PUBLIC_REPOSITORIES.includes(repo)
  const isPrivate = c.env.PRIVATE_REPOSITORIES.includes(repo)

  if (!isPublic && !isPrivate) {
    return c.notFound()
  }

  if (isPublic && c.req.method === "GET") {
    return next()
  }

  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
