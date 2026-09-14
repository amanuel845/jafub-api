const API="https://api.github.com";
export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  if(req.method!=="GET")return res.status(405).json({message:"Method not allowed"});
  try{
    const h={Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"GitHub-API-Playground/2.0"};
    if(req.headers.authorization)h.Authorization=req.headers.authorization;
    const r=await fetch(API+"/meta",{headers:h}),t=await r.text();
    res.status(r.status).setHeader("Content-Type",r.headers.get("content-type")||"application/json");
    return res.send(t);
  }catch(e){return res.status(500).json({message:e.message})}
}