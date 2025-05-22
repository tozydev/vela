import { Repository } from "./types"

export class RepositoryImpl implements Repository {
  public readonly name: string
  public readonly private: boolean
  public readonly bucket: R2Bucket
  public readonly prefix: string

  constructor(name: string, isPrivate: boolean, bucket: R2Bucket, prefix: string | null) {
    this.name = name
    this.bucket = bucket
    this.private = isPrivate
    this.prefix = prefix ? prefix.replace(/(^\/)|(\/$)/, "") : ""
  }

  private getFullPath(path: string): string {
    return this.prefix.length > 0 ? `${this.prefix}/${path}` : path
  }

  getArtifact(path: string): Promise<R2ObjectBody | null> {
    const fullPath = this.getFullPath(path)
    return this.bucket.get(fullPath)
  }

  putArtifact(path: string, body: ReadableStream | ArrayBuffer | ArrayBufferView | Blob, options?: R2PutOptions): Promise<R2Object> {
    const fullPath = this.getFullPath(path)
    return this.bucket.put(fullPath, body, options)
  }

  deleteArtifact(path: string): Promise<void> {
    const fullPath = this.getFullPath(path)
    return this.bucket.delete(fullPath)
  }
}
