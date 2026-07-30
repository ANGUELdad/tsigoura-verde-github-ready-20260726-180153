const assert = require('assert');

process.env.ADMIN_PIN = 'upload-test-pin';
delete process.env.BLOB_READ_WRITE_TOKEN;

function invoke(handler, { method='POST', headers={} } = {}) {
  return new Promise((resolve, reject) => {
    const req = { method, headers };
    const res = {
      headers:{},
      setHeader(name,value){ this.headers[name]=value; },
      status(code){
        return { json:body => resolve({status:code,body,headers:res.headers}) };
      }
    };
    Promise.resolve(handler(req,res)).catch(reject);
  });
}

const upload = require('../api/admin-upload');

(async()=>{
  let result=await invoke(upload,{method:'GET'});
  assert.equal(result.status,405);

  result=await invoke(upload,{headers:{
    'x-admin-pin':'wrong',
    'content-type':'image/png',
    'content-length':'100'
  }});
  assert.equal(result.status,401);

  result=await invoke(upload,{headers:{
    'x-admin-pin':process.env.ADMIN_PIN,
    'content-type':'image/png',
    'content-length':'100'
  }});
  assert.equal(result.status,503);
  assert.equal(result.body.error,'blob_not_configured');

  process.env.BLOB_READ_WRITE_TOKEN='test-token';
  result=await invoke(upload,{headers:{
    'x-admin-pin':process.env.ADMIN_PIN,
    'content-type':'text/html',
    'content-length':'100'
  }});
  assert.equal(result.status,415);
  assert.equal(result.body.error,'unsupported_image_type');

  result=await invoke(upload,{headers:{
    'x-admin-pin':process.env.ADMIN_PIN,
    'content-type':'image/png',
    'content-length':String(4*1024*1024+1)
  }});
  assert.equal(result.status,413);
  assert.equal(result.body.error,'image_too_large');

  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.BLOB_STORE_ID='store_oidc_test';
  result=await invoke(upload,{headers:{
    'x-admin-pin':process.env.ADMIN_PIN,
    'content-type':'application/pdf',
    'content-length':'100'
  }});
  assert.equal(result.status,415);
  assert.equal(result.body.error,'unsupported_image_type');

  delete process.env.BLOB_STORE_ID;
  delete process.env.ADMIN_PIN;
  result=await invoke(upload,{headers:{
    'x-admin-pin':'anything',
    'content-type':'image/png',
    'content-length':'100'
  }});
  assert.equal(result.status,503);
  assert.equal(result.body.error,'admin_pin_not_set');

  console.log('upload-security: 12/12 assertions passed');
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});
