import { createMiddleware } from "hono/factory"
import { basicAuth } from "hono/basic-auth"
import type { VelaContext } from "./types"
import { RepositoryImpl } from "./repository"

export const authHandler = createMiddleware(async (c: VelaContext, next) => {
  const repo = c.req.param("repo")
  if (!repo) {
    return c.notFound()
  }

  const config = c.env.REPOSITORIES.find((config) => config.name === repo)
  if (!config) {
    return c.notFound()
  }

  const bucket = c.env[config.bucket]
  if (!bucket) {
    return c.notFound()
  }

  const repository = new RepositoryImpl(config.name, config.private, bucket, config.prefix)
  c.set("repository", repository)

  if (!config.private && c.req.method === "GET") {
    return next()
  }

  const auth = basicAuth({
    verifyUser: (username, password, c1) => {
      if (username === c.env.REPOSITORY_USERNAME && password === c.env.REPOSITORY_PASSWORD) {
        return true
      }

      const repositoryUsername = c1.env[`REPOSITORY_${repo.toUpperCase()}_USERNAME`]
      const repositoryPassword = c1.env[`REPOSITORY_${repo.toUpperCase()}_PASSWORD`]
      if (!repositoryUsername || !repositoryPassword) {
        return false
      }

      return username === repositoryUsername && password === repositoryPassword
    }
  })
  return auth(c, next)
})
