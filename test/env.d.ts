declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    SHARED_BUCKET: R2Bucket
    ISOLATED_PUBLIC_BUCKET: R2Bucket
    ISOLATED_PRIVATE_BUCKET: R2Bucket
  }
}
