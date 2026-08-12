const {
  configured, adminPinOk, adminPinConfigured, clean,
  adminPinFromReq, readAdminHistory, restoreMenuBackup,
  parseJsonBody, applyCors, handlePreflight
} = require('./_store');

const attempts = globalThis.__tvHistoryAttempts || (globalThis.__tvHistoryAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local',120).split(',')[0].trim() || 'local';

function blocked(key) {
  const now=Date.now(), windowMs=5*60*1000;
  const recent=(attempts.get(key)||[]).filter(t=>now-t<windowMs);
  attempts.set(key,recent);
  return recent.length>=12;
}
function failed(key) {
  const recent=attempts.get(key)||[];
  recent.push(Date.now()); attempts.set(key,recent.slice(-12));
}

module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  if (handlePreflight(req, res)) return;
  applyCors(req, res);

  if(!['GET','POST'].includes(req.method)){
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({ok:false,error:'method_not_allowed'});
  }
  try{
    if(!configured()) return res.status(503).json({ok:false,configured:false,error:'store_not_configured'});
    if(!adminPinConfigured()) return res.status(503).json({ok:false,configured:true,error:'admin_pin_not_set'});
    const data=req.method==='POST'?await parseJsonBody(req):{};
    const ip=ipOf(req);
    if(blocked(ip)) return res.status(429).json({ok:false,error:'too_many_attempts'});
    if(!adminPinOk(adminPinFromReq(req,data))){
      failed(ip);
      return res.status(401).json({ok:false,error:'wrong_pin'});
    }
    attempts.delete(ip);
    if(req.method==='GET'){
      const result=await readAdminHistory();
      return res.status(200).json({ok:true,configured:true,backups:result.backups,history:result.history});
    }
    const restoreId=clean(data.restoreId,80);
    if(!restoreId) return res.status(400).json({ok:false,error:'restore_id_required'});
    const doc=await restoreMenuBackup(restoreId,{revision:Date.now(),updatedBy:ipOf(req)});
    if(!doc) return res.status(404).json({ok:false,error:'backup_not_found'});
    return res.status(200).json({ok:true,configured:true,state:doc.state,revision:doc.revision,updatedAt:doc.updatedAt});
  }catch(err){
    return res.status(err.status||500).json({ok:false,error:err.message||'server_error',detail:String(err.detail||'').slice(0,200)});
  }
};
