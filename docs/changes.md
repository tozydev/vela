# Changes

This file contains a list of changes made to the Vela project.
This file also provides migration guides for breaking changes.

## 1.0.0 (2025-06-xx)

### Breaking Changes

- Changes Wrangler configuration file format from `wangler.toml` to `wrangler.jsonc`.
- Rename `USERNAME` and `PASSWORD` environment variables to `VELA_USERNAME` and `VELA_PASSWORD`.
- Merge `PUBLIC_REPOSITORIES` and `PRIVATE_REPOSITORIES` into a single `REPOSITORIES` vars configuration.

### Features

- Introduce `REPOSITORIES` vars configuration with detail on each repository.
- Support for multiple repositories with different authentication credentials.
- Support for isolated or shared Cloudflare R2 buckets.
- Artifact MIME type detection based on file extension when deploying.

### Others

- Update dependencies to latest versions.
- Clean up the codebase and improve documentation.
- Remove some unused configuration options.

### Migration Guide

***Notes:*** You can keep using `wrangler.toml`, but I recommend migrating to `wrangler.jsonc` for easier configuration
with new configuration options. You can use `TOMl to JSON tool` or manually copy configuration options to new format.
Future documentation will be provided for `wrangler.jsonc` only.

To migrate from the previous version to 1.0.0, follow these steps (I assumed that you've migrated to `wrangler.jsonc`):

1. **Update Environment Variables**: Rename `USERNAME` and `PASSWORD` to `VELA_USERNAME` and `VELA_PASSWORD`.
2. **Update Configuration**: Merge `PUBLIC_REPOSITORIES` and `PRIVATE_REPOSITORIES` into a single `REPOSITORIES`
   configuration.

    - For example, if you had:
        ```toml
        [[vars]]
        PUBLIC_REPOSITORIES = ["releases", "snapshots"]
        PRIVATE_REPOSITORIES = ["private"]
        ```

    - Then, you should change it to:
       ```json
       {
         "vars": {
           "REPOSITORIES": [
             {
               "name": "releases",
               "private": false,
               "bucket": "VELA_BUCKET",
               "prefix": "releases"
             },
             {
               "name": "snapshots",
               "private": false,
               "bucket": "VELA_BUCKET",
               "prefix": "snapshots"
             },
             {
               "name": "private",
               "private": true,
               "bucket": "VELA_BUCKET",
               "prefix": "private"
             }
           ]
         }
       }
       ```
