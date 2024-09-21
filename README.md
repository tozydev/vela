# Vela

📦 Lightweight Maven based artifact repository for Cloudflare Workers

This project is a simple Maven based artifact repository for Cloudflare Workers platform. It isn't a full-fledged
artifact repository like Nexus or Artifactory, but it's a simple solution for small projects that need to store and
retrieve artifacts. I chose Cloudflare Workers because it's free and it's a serverless platform, so you don't need to
worry about the infrastructure.

## Features

- Lightweight and easy to use.
- Store and retrieve artifacts via API.
- Basic authentication.
- Maven, Gradle, etc. are supported.

## Limitations

- No UI for managing artifacts.
- No support for listing/browsing artifacts.
- Lack of features compared to full-fledged artifact repositories.

## Infrastructure

- [Cloudflare Workers](https://www.cloudflare.com/developer-platform/workers/)
- [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
