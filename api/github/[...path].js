const API = "https://api.github.com";

function send(res, status, body, headers = {}) {
  for (const [k, v] of Object.entries(headers)) if (v != null) res.setHeader(k, v);
  return typeof body === "string" ? res.status(status).send(body) : res.status(status).json(body);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-GitHub-Api-Version,Accept");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    let path = Array.isArray(req.query?.path) ? req.query.path.join("/") : String(req.query?.path || "");
    path = "/" + path.replace(/^\/+/, "");
    if (path.includes("://") || path.includes("\0") || path.split("/").includes("..")) {
      return send(res, 400, { message: "Invalid GitHub API path." });
    }

    const upstream = new URL(API + path);
    const incoming = new URL(req.url, "http://localhost");
    for (const [key, value] of incoming.searchParams.entries()) {
      if (key !== "path") upstream.searchParams.append(key, value);
    }

    const headers = {
      Accept: req.headers.accept || "application/vnd.github+json",
      "X-GitHub-Api-Version": req.headers["x-github-api-version"] || "2022-11-28",
      "User-Agent": "GitHub-API-Playground/2.0"
    };
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;
    if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];

    let body;
    if (!["GET", "HEAD"].includes(req.method) && req.body != null) {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const r = await fetch(upstream, { method: req.method, headers, body });
    const text = await r.text();
    const pass = {};
    for (const name of [
      "content-type","x-ratelimit-limit","x-ratelimit-remaining","x-ratelimit-reset",
      "x-ratelimit-used","x-ratelimit-resource","x-github-request-id","etag","location",
      "link","retry-after","deprecation","sunset"
    ]) {
      const v = r.headers.get(name);
      if (v) pass[name] = v;
    }
    return send(res, r.status, text, pass);
  } catch (err) {
    return send(res, err.status || 500, {
      message: err.message || "GitHub proxy error",
      documentation_url: "https://docs.github.com/en/rest"
    });
  }
}
