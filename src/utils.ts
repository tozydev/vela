const mimeTypes: { [key: string]: string } = {
  "jar": "application/java-archive",
  "xml": "application/xml",
  "pom": "application/xml",
  "json": "application/json",
  "zip": "application/zip",
  "module": "application/vnd.org.gradle.module+json",
  "asc": "application/pgp-signature",
  "md5": "text/plain",
  "sha1": "text/plain",
  "sha256": "text/plain",
  "sha512": "text/plain",
  "toml": "application/toml"
}

export const getMimeType = (path: string) => {
  const extension = path.split(".").pop()
  return extension ? mimeTypes[extension] : null
}
