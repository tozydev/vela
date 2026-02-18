# Vela

> [!IMPORTANT]
> This project is no longer maintained.

📦 Lightweight Maven-compatible artifact hosting powered by Cloudflare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tozydev/vela)

Vela is a minimal, serverless artifact hosting service designed for small or personal use. Built on **Cloudflare Workers** and **R2**, it supports multiple repositories, basic authentication, and integration with Maven, Gradle, and other tools.

## ✨ Features

- ✅ Lightweight and easy to use
- 🔐 Basic authentication with per-repository credentials
- 📁 Support for isolated or shared Cloudflare R2 buckets
- 🛠️ Compatible with Maven, Gradle, and similar build tools
- ☁️ Fully serverless — no infrastructure management

## ⚠️ Limitations

- ❌ No UI for artifact management
- ❌ No artifact browsing or listing support
- ⚠️ Not a replacement for full-featured solutions like Nexus or Artifactory

## 🧰 Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Package Manager**: [bun](https://bun.sh)
- **Framework**: [Hono](https://hono.dev)
- **Build Tool**: [Vite](https://vite.dev)
- **Testing**: [Vitest](https://vitest.dev)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)

## 🚀 Getting Started

Work-in-progress...

## 🔧 Configuration

### Repository Configuration

The `REPOSITORIES` variable is a JSON array of objects, each representing a repository. Each object should contain the following properties (empty default value is required):

| Property  | Type    | Default value | Description                                                  |
|-----------|---------|---------------|--------------------------------------------------------------|
| `name`    | string  |               | The name of the repository, this also is a repository path.  |
| `private` | boolean | `false`       | Whether the repository is private or public.                 |
| `bucket`  | string  |               | The Cloudflare R2 bucket name, must be a R2 bucket binding.  |
| `prefix`  | string  | `/`           | The prefix for the artifact path when storing in the bucket. |

**Example configurations:**

<details>

<summary>Shared bucket for public repositories (recommended)</summary>

```json
{
  "vars": {
    "REPOSITORIES": [
      {
        "name": "releases",
        "private": false,
        "bucket": "VELA_PUBLIC",
        "prefix": "releases"
      },
      {
        "name": "snapshots",
        "private": false,
        "bucket": "VELA_PUBLIC",
        "prefix": "snapshots"
      },
      {
        "name": "private",
        "private": true,
        "bucket": "VELA_PRIVATE",
        "prefix": "private"
      }
    ]
  },
  "r2_buckets": [
    {
      "binding": "VELA_PUBLIC",
      "bucket_name": "vela-public"
    },
    {
      "binding": "VELA_PRIVATE",
      "bucket_name": "vela-private"
    }
  ]
}
```

</details>

<details>

<summary>Shared bucket for multiple repositories</summary>

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
  },
  "r2_buckets": [
    {
      "binding": "VELA_BUCKET",
      "bucket_name": "vela"
    }
  ]
}
```

</details>

<details>

<summary>Isolated bucket for each repository</summary>

```json
{
  "vars": {
    "REPOSITORIES": [
      {
        "name": "releases",
        "private": false,
        "bucket": "VELA_RELEASES",
        "prefix": null
      },
      {
        "name": "snapshots",
        "private": false,
        "bucket": "VELA_SNAPSHOTS",
        "prefix": null
      },
      {
        "name": "private",
        "private": true,
        "bucket": "VELA_PRIVATE",
        "prefix": null
      }
    ]
  },
  "r2_buckets": [
    {
      "binding": "VELA_RELEASES",
      "bucket_name": "vela-releases"
    },
    {
      "binding": "VELA_SNAPSHOTS",
      "bucket_name": "vela-snapshots"
    },
    {
      "binding": "VELA_PRIVATE",
      "bucket_name": "vela-private"
    }
  ]
}
```

</details>

### Authentication Credentials

Vela uses environment variables for authentication credentials. You can set the following variables:

| Variable                                | Description                                       |
|-----------------------------------------|---------------------------------------------------|
| `REPOSITORY_USERNAME`                   | The username for all repositories (required)      |
| `REPOSITORY_PASSWORD`                   | The password for all repositories (required)      |
| `REPOSITORY_<repository name>_USERNAME` | The username for a specific repository (optional) |
| `REPOSITORY_<repository name>_PASSWORD` | The password for a specific repository (optional) |

_Where `<repository name>` is the name of the repository as defined in the `REPOSITORIES` configuration._

I recommend using a strong random password for `REPOSITORY_PASSWORD` and `REPOSITORY_<repository name>_PASSWORD` to secure your repositories.

## 📚 Documentation

* [API Documentation](docs/api-docs.md)

## 💥 Breaking Changes

If you are upgrading from a previous version, please refer to the [CHANGELOG](docs/changes.md) for details on breaking changes and migration steps.

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.