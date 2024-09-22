# Vela API Documentation

- Public repository: `releases`, `snapshots`
- Private repository: `private`

## Authentication

Vela uses basic authentication for securing the API.

Example:

```bash
curl -u username:password https://vela.example.com/private/com/example/vela/1.0.0/vela-1.0.0.pom
```

## Routes

### GET /{repository}/{artifact}

Retrieve an artifact.

#### Parameters

- `repository`: The repository name.
- `artifact`: The artifact path.

#### Response

- Status:

  - `200 OK`: The artifact is found.
  - `401 Unauthorized`: The request is not authenticated (private repository).
  - `404 Not Found`: The artifact is not found.

- Body: Stream the artifact content.

#### Example

```bash
curl https://vela.example.com/releases/com/example/vela/1.0.0/vela-1.0.0.pom
```

### POST /{repository}/{artifact}

Deploy an artifact.

#### Parameters

- `repository`: The repository name.
- `artifact`: The artifact path.

#### Request

- The request body is the artifact content.

#### Response

- Status:

  - `201 Created`: The artifact is deployed.
  - `401 Unauthorized`: The request is not authenticated.

#### Example

```bash
curl -X POST -u username:password -T vela-1.0.0.pom https://vela.example.com/private/com/example/vela/1.0.0/vela-1.0.0.pom
```

### PUT /{repository}/{artifact}

Like `POST /{repository}/{artifact}`, deploy an artifact.

#### Parameters

- `repository`: The repository name.
- `artifact`: The artifact path.

#### Request

- The request body is the artifact content.

#### Response

- Status:

  - `201 Created`: The artifact is deployed.
  - `401 Unauthorized`: The request is not authenticated.

#### Example

```bash
curl -X PUT -u username:password -T vela-1.0.0.pom https://vela.example.com/private/com/example/vela/1.0.0/vela-1.0.0.pom
```

### DELETE /{repository}/{artifact}

Delete an artifact.

#### Parameters

- `repository`: The repository name.
- `artifact`: The artifact path.

#### Response

- Status:

  - `204 No Content`: The artifact is deleted.
  - `401 Unauthorized`: The request is not authenticated.

#### Example

```bash
curl -X DELETE -u username:password https://vela.example.com/private/com/example/vela/1.0.0/vela-1.0.0.pom
```
