# GitHub API Playground V2

A compact, Vercel-ready **GitHub REST + GraphQL API playground**.

## V2 upgrades
- Reliable Vercel catch-all REST routing via `api/github/[...path].js`
- GET / POST / PUT / PATCH / DELETE
- GraphQL query + variables explorer
- Fine-grained PAT authentication
- Live rate-limit headers and resource display
- Request counter and session history
- Searchable endpoint catalog
- Custom REST paths
- JSON formatter and raw/pretty response toggle
- Copy response
- cURL generator
- HTTP status, latency and GitHub request ID
- Mobile-responsive tabs
- Built-in Docs tab
- `package.json`, `vercel.json`, `vercel.js`
- Node 20.x

## Deploy
Push the folder to GitHub → import the repository into Vercel → deploy.

## Auth
Enter a GitHub fine-grained personal access token in **Auth**. The token is stored in browser localStorage for the playground and sent as a Bearer token. Use minimum required permissions and never commit the token.

## REST
`/api/github/<path>` proxies to `https://api.github.com/<path>` and preserves query parameters. The proxy sends GitHub API version `2022-11-28` and exposes common rate, request-ID, ETag, Link, Retry-After and deprecation headers.

## GraphQL
`POST /api/graphql` accepts:
```json
{"query":"query { viewer { login } }","variables":{}}
```

## Endpoint catalog
Core, repositories, issues/PRs, search, organizations, Actions, gists/notifications, Git data, packages and security. The custom path box can call endpoints outside the catalog.

## Security
This is a developer playground. Browser localStorage is convenient but not a secure vault. For public deployment, consider authentication, restrictive CORS, server-side token handling, and GitHub token restrictions.
