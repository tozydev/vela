import { Context } from "hono"

export type VelaVariables = {
  repository: Repository
}
export type VelaEnv = { Bindings: CloudflareBindings & { [key: string]: string | null }, Variables: VelaVariables }
export type VelaContext = Context<VelaEnv>

export interface Repository {
  name: string
  private: boolean
  bucket: R2Bucket
  prefix: string

  getArtifact(path: string): Promise<R2ObjectBody | null>

  putArtifact(path: string, body: ReadableStream | ArrayBuffer | ArrayBufferView | Blob, options?: R2PutOptions): Promise<R2Object>

  deleteArtifact(path: string): Promise<void>
}
