# Vela

📦 Lightweight Maven-compatible artifact hosting powered by Cloudflare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tozydev/vela)

Vela is a minimal, serverless artifact hosting service designed for small or personal use. Built on
**Cloudflare Workers** and **R2**, it supports multiple repositories, basic authentication, and integration with Maven,
Gradle, and other tools.

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

## 📚 Documentation

* [API Documentation](docs/API_DOCS.md)

## 💥 Breaking Changes

If you are upgrading from a previous version, please refer to the [CHANGELOG](docs/changes.md) for details on breaking
changes and migration steps.

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
