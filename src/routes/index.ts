export { deleteArtifact } from "./deleteArtifact"
export { deployArtifact } from "./deployArtifact"
export { getArtifact } from "./getArtifact"

export const Routes = {
  REPO: "/:repo/*",
  ARTIFACT_PATH: "/:repo/:path{.+}",
}
