import { describe, expect, it, vi } from "vitest"
import { RepositoryImpl } from "../src/repository"

const mockBucket: R2Bucket = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  head: function(): Promise<R2Object | null> {
    throw new Error("Function not implemented.")
  },
  createMultipartUpload: function(): Promise<R2MultipartUpload> {
    throw new Error("Function not implemented.")
  },
  resumeMultipartUpload: function(): R2MultipartUpload {
    throw new Error("Function not implemented.")
  },
  list: function(): Promise<R2Objects> {
    throw new Error("Function not implemented.")
  }
}

describe("RepositoryImpl", () => {
  it("should construct full path with prefix", () => {
    const repo = new RepositoryImpl("test-repo", false, mockBucket, "releases")
    // @ts-ignore
    const fullPath = repo.getFullPath("com/example/artifact.pom")
    expect(fullPath).toBe("releases/com/example/artifact.pom")
  })

  it("should construct full path with a prefix ending in a slash", () => {
    const repo = new RepositoryImpl("test-repo", false, mockBucket, "releases/")
    // @ts-ignore
    const fullPath = repo.getFullPath("com/example/artifact.pom")
    expect(fullPath).toBe("releases/com/example/artifact.pom")
  })

  it("should construct full path without prefix", () => {
    const repo = new RepositoryImpl("test-repo", false, mockBucket, null)
    // @ts-ignore
    const fullPath = repo.getFullPath("com/example/artifact.pom")
    expect(fullPath).toBe("com/example/artifact.pom")
  })

  it("should call bucket.get with the correct prefixed path", async () => {
    const repo = new RepositoryImpl("test-repo", false, mockBucket, "artifacts")
    await repo.getArtifact("path/to/file.jar")
    expect(mockBucket.get).toHaveBeenCalledWith("artifacts/path/to/file.jar")
  })

  it("should call bucket.put with the correct prefixed path", async () => {
    const repo = new RepositoryImpl("test-repo", false, mockBucket, "artifacts")
    const body = new Blob(["test content"])
    const options = { httpMetadata: { contentType: "text/plain" } }
    await repo.putArtifact("path/to/file.jar", body, options)
    expect(mockBucket.put).toHaveBeenCalledWith("artifacts/path/to/file.jar", body, options)
  })

  it("should call bucket.delete with the correct prefixed path", async () => {
    const repo = new RepositoryImpl("test-repo", true, mockBucket, "private-artifacts")
    await repo.deleteArtifact("path/to/delete.pom")
    expect(mockBucket.delete).toHaveBeenCalledWith("private-artifacts/path/to/delete.pom")
  })
})
