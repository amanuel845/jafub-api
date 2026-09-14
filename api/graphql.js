const API = "https://api.github.com/graphql";
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({message:"Use POST."});
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if (!body.query || typeof body.query !== "string") return res.status(400).json({message:"GraphQL query is required."});
    const headers = {Accept:"application/json","Content-Type":"application/json","User-Agent":"GitHub-API-Playground/2.0"};
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;
    const r = await fetch(API, {method:"POST",headers,body:JSON.stringify({
      query:body.query, variables:body.variables || {}, operationName:body.operationName || undefined
    })});
    const text = await r.text();
    for (const name of ["content-type","x-ratelimit-limit","x-ratelimit-remaining","x-ratelimit-reset","x-ratelimit-used","x-ratelimit-resource","x-github-request-id"]) {
      const v=r.headers.get(name); if(v) res.setHeader(name,v);
    }
    return res.status(r.status).send(text);
  } catch(e) { return res.status(500).json({message:e.message||"GraphQL proxy error"}); }
}
