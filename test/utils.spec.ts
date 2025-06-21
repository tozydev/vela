import { getMimeType } from "../src/utils"

describe("getMimeType", () => {
  it("should return correct MIME type for jar files", () => {
    expect(getMimeType("example.jar")).toBe("application/java-archive")
    expect(getMimeType("path/to/artifact.jar")).toBe("application/java-archive")
  })

  it("should return correct MIME type for XML files", () => {
    expect(getMimeType("pom.xml")).toBe("application/xml")
    expect(getMimeType("config.xml")).toBe("application/xml")
  })

  it("should return correct MIME type for JSON files", () => {
    expect(getMimeType("package.json")).toBe("application/json")
    expect(getMimeType("config.json")).toBe("application/json")
  })

  it("should return correct MIME type for ZIP files", () => {
    expect(getMimeType("archive.zip")).toBe("application/zip")
  })

  it("should return correct MIME type for Gradle module files", () => {
    expect(getMimeType("gradle.module")).toBe("application/vnd.org.gradle.module+json")
  })

  it("should return correct MIME type for signature files", () => {
    expect(getMimeType("artifact.asc")).toBe("application/pgp-signature")
  })

  it("should return text/plain for hash files", () => {
    expect(getMimeType("artifact.md5")).toBe("text/plain")
    expect(getMimeType("artifact.sha1")).toBe("text/plain")
    expect(getMimeType("artifact.sha256")).toBe("text/plain")
    expect(getMimeType("artifact.sha512")).toBe("text/plain")
  })

  it("should return null for unknown extensions", () => {
    expect(getMimeType("unknown.xyz")).toBeUndefined()
    expect(getMimeType("README")).toBeUndefined()
  })

  it("should return null for files without extension", () => {
    expect(getMimeType("README")).toBeUndefined()
    expect(getMimeType("Dockerfile")).toBeUndefined()
  })

  it("should handle complex paths correctly", () => {
    expect(getMimeType("com/example/artifact/1.0.0/artifact-1.0.0.jar")).toBe("application/java-archive")
    expect(getMimeType("org/springframework/spring-core/5.3.21/spring-core-5.3.21.pom.xml")).toBe("application/xml")
  })

  it("should be case sensitive for extensions", () => {
    expect(getMimeType("example.JAR")).toBeUndefined()
    expect(getMimeType("example.XML")).toBeUndefined()
  })

  it("should handle files with multiple dots", () => {
    expect(getMimeType("spring-boot-starter-web-2.7.0.jar")).toBe("application/java-archive")
    expect(getMimeType("artifact-1.0.0.pom.xml")).toBe("application/xml")
  })
})
