import { Context } from "hono"

export type VelaVariables = {
  bucket: R2Bucket
}
export type VelaEnv = { Bindings: CloudflareBindings, Variables: VelaVariables }
export type VelaContext = Context<VelaEnv>
