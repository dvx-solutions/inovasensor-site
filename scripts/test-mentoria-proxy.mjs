import {build} from 'vite';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

// Bundle only this server module, avoiding a second runtime dependency for TS tests.
await build({configFile:false,logLevel:'silent',build:{
  ssr:'app/lib/mentoria-leads.server.ts',outDir:'.output/mentoria-proxy-test',
  rollupOptions:{external:['zod'],output:{entryFileNames:'proxy.mjs'}},
}});
const {forwardMentoriaLead} = await import(pathToFileURL(path.resolve('.output/mentoria-proxy-test/proxy.mjs')).href);
const payload = {
  id:'82a9840b-b1be-4e1d-b456-2a7ca1ab6c49',name:'Teste automatizado',email:'qa@example.com',phone:'11999999999',consent:true,website:'',source:{utm_source:'teste'},
  answers:{company:'Empresa de teste',segment:'Serviços B2B',team:'6 a 15 pessoas',role:'Sou dono(a) / sócio(a)',decision:'Decido este investimento',manager:'Tenho gestores responsáveis',ai:['Ainda não uso'],aiOther:'',teamAi:'Ainda não usa',systems:['ERP / CRM'],process:'Atendimento e demandas',detail:'Demandas recorrentes ficam aguardando o gestor.',frequency:'Todos os dias',impact:'Retrabalho e erros',revenue:'R$100 mil a R$300 mil',budget:'Podemos avaliar uma proposta após o diagnóstico',owner:'Tenho um gestor para conduzir',time:'Sim, consigo reservar esse tempo',start:'Nos próximos 30 dias'},
};
const makeRequest=(body=payload,headers={})=>new Request('https://www.inovasensor.com.br/api/mentoria/leads',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://www.inovasensor.com.br',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
const result=(status=201,body={receipt:payload.id,route:'conversa'})=>Response.json(body,{status});
let passed=0;
async function check(name,run){await run();passed++;console.log('PASS '+name);}
const noNetwork=async()=>{throw Error('O teste não deve acessar produção');};
await check('origem externa bloqueada',async()=>assert.equal((await forwardMentoriaLead(makeRequest(payload,{Origin:'https://invalid.example'}),noNetwork)).status,403));
await check('conteúdo não JSON bloqueado',async()=>assert.equal((await forwardMentoriaLead(makeRequest(payload,{'Content-Type':'text/plain'}),noNetwork)).status,415));
await check('JSON inválido bloqueado',async()=>assert.equal((await forwardMentoriaLead(makeRequest('{'),noNetwork)).status,400));
await check('limite aplicado antes do upstream',async()=>assert.equal((await forwardMentoriaLead(makeRequest('x'.repeat(15001)),noNetwork)).status,413));
await check('consentimento obrigatório',async()=>assert.equal((await forwardMentoriaLead(makeRequest({...payload,consent:false}),noNetwork)).status,400));
await check('honeypot obrigatório vazio',async()=>assert.equal((await forwardMentoriaLead(makeRequest({...payload,website:'spam'}),noNetwork)).status,400));
await check('score do cliente rejeitado',async()=>assert.equal((await forwardMentoriaLead(makeRequest({...payload,score:100}),noNetwork)).status,400));
await check('destino fixo e headers de identidade não encaminhados',async()=>{
  const res=await forwardMentoriaLead(makeRequest(payload,{Cookie:'session=test',Authorization:'test','oai-authenticated-user-email':'not-forwarded@example.com'}),async(url,options)=>{
    assert.equal(url,'https://inovasensor-mentoria-ia.gustavobilonia.chatgpt.site/api/leads');
    assert.deepEqual(options.headers,{'Content-Type':'application/json'});
    assert.equal(options.redirect,'error');assert(options.signal);
    assert.equal(JSON.parse(options.body).id,payload.id);return result();
  });assert.equal(res.status,201);assert.equal((await res.json()).receipt,payload.id);assert.equal(res.headers.get('cache-control'),'no-store');
});
await check('retry preserva mesmo recibo e status200',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>result(200))).status,200));
await check('HTML/login não confirma recebimento',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}}))).status,503));
await check('recibo diferente não confirma recebimento',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>result(201,{receipt:'outro',route:'conversa'}))).status,503));
await check('rota desconhecida não confirma recebimento',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>result(201,{receipt:payload.id,route:'invalida'}))).status,503));
await check('limite diário preservado',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>result(429,{error:'limit'}))).status,429));
await check('falha do upstream preserva erro',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),async()=>result(500,{error:'interno'}))).status,503));
await check('falha de rede preserva tentativa segura',async()=>assert.equal((await forwardMentoriaLead(makeRequest(),noNetwork)).status,503));
console.log(`${passed} testes passaram; nenhuma avaliação enviada a produção.`);
