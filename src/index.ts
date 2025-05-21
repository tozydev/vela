import { Hono } from "hono"
import { repoAccess } from "./middlewares/repoAccess"
import { deleteArtifact, deployArtifact, getArtifact, Routes } from "./routes"

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(Routes.REPO, repoAccess)
app.get(Routes.ARTIFACT_PATH, getArtifact).post(deployArtifact).put(deployArtifact).delete(deleteArtifact)

export default app
