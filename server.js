// Denop Systems — dispatch server. Zero dependencies (Node >= 18).
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,DIR=process.env.DATA_DIR||path.join(__dirname,'data');
fs.mkdirSync(path.join(DIR,'uploads'),{recursive:true});
const DBF=path.join(DIR,'db.json');
const db=fs.existsSync(DBF)?JSON.parse(fs.readFileSync(DBF,'utf8')):{users:[],clients:[],jobs:[],withdrawals:[]};
const save=()=>{fs.writeFileSync(DBF+'.tmp',JSON.stringify(db));fs.renameSync(DBF+'.tmp',DBF)};
const uid=()=>crypto.randomBytes(6).toString('hex');
const SF=path.join(DIR,'secret');if(!fs.existsSync(SF))fs.writeFileSync(SF,crypto.randomBytes(32).toString('hex'));
const SECRET=process.env.SESSION_SECRET||fs.readFileSync(SF,'utf8');
const PK={Basic:50000,Chiva:75000,Challenger:130000},RATE=0.4,ROLES=['marketer','installer','admin'];
const mk=p=>{const salt=crypto.randomBytes(16).toString('hex');return{salt,hash:crypto.scryptSync(p,salt,64).toString('hex')}};
const chk=(u,p)=>crypto.timingSafeEqual(crypto.scryptSync(p,u.salt,64),Buffer.from(u.hash,'hex'));
if(!db.users.some(u=>u.role==='admin')){const pw=process.env.ADMIN_PASSWORD||'12345678',em=(process.env.ADMIN_EMAIL||'onenrogers@gmail.com').toLowerCase();
 db.users.push({id:uid(),name:'Administrator',email:em,phone:'',role:'admin',active:true,mustChange:!process.env.ADMIN_PASSWORD,...mk(pw)});save();console.log(`\n== First admin created: ${em} ==\n   ${process.env.ADMIN_PASSWORD?'Password from ADMIN_PASSWORD.':'Default password in use: you will be forced to change it at first login.'}\n`)}
const sign=s=>crypto.createHmac('sha256',SECRET).update(s).digest('hex');
const token=u=>{const b=`${u.id}.${Date.now()+12*3600e3}`;return`${b}.${sign(b)}`};
const who=req=>{const m=/(?:^|; )s=([^;]+)/.exec(req.headers.cookie||'');if(!m)return;const[i,e,g]=m[1].split('.');if(!g||sign(`${i}.${e}`)!==g||+e<Date.now())return;const u=db.users.find(x=>x.id===i);return u&&u.active?u:undefined};
const pub=u=>({id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role,active:u.active,mustChange:!!u.mustChange});
const fails={};const limited=ip=>(fails[ip]||[]).filter(t=>t>Date.now()-9e5).length>=8;
class E extends Error{constructor(c,m){super(m);this.c=c}}
const str=(v,max,min=1,n='Field')=>{v=String(v??'').trim();if(v.length<min||v.length>max)throw new E(400,`${n} is required (max ${max} chars)`);return v};
const phone=v=>{v=str(v,20,7,'Phone').replace(/[\s-]/g,'');if(!/^\+?\d{9,15}$/.test(v))throw new E(400,'Enter a valid phone number');return v};
const email=v=>{v=str(v,120,3,'Email').toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new E(400,'Enter a valid email');return v};
const pin=p=>{if(!p||p.lat==null)return null;const lat=+p.lat,lng=+p.lng;if(!(lat>=-90&&lat<=90&&lng>=-180&&lng<=180))throw new E(400,'Invalid location pin');return{lat,lng}};
const need=(u,...r)=>{if(!r.includes(u.role))throw new E(403,'Not allowed')};
const wd=id=>db.withdrawals.filter(w=>w.marketerId===id);
const money=id=>{const earned=db.clients.filter(c=>c.marketerId===id).reduce((a,c)=>a+c.commission,0),w=wd(id),
 paid=w.filter(x=>x.status==='paid').reduce((a,x)=>a+x.amount,0),pending=w.filter(x=>x.status==='pending').reduce((a,x)=>a+x.amount,0);
 return{earned,paid,pending,available:earned-paid-pending}};
const newJob=(o)=>{const j={id:uid(),clientId:null,installerId:null,status:'unassigned',photos:[],notes:'',createdAt:Date.now(),...o};db.jobs.push(j);return j};
const MAGIC={jpg:b=>b[0]===0xFF&&b[1]===0xD8,png:b=>b[0]===0x89&&b[1]===0x50,webp:b=>b.slice(0,4).toString()==='RIFF'};
function img(d){const m=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(d||'');if(!m)throw new E(400,'Photos must be JPG, PNG or WEBP');
 const b=Buffer.from(m[2],'base64'),ext=m[1]==='jpeg'?'jpg':m[1];if(b.length>2.5e6||!MAGIC[ext](b))throw new E(400,'Photo too large or invalid');return{b,ext}}

async function api(req,url,body,res){
 const m=req.method,p=url.pathname.slice(5);let r;
 if(m==='POST'&&p==='login'){const ip=req.socket.remoteAddress;if(limited(ip))throw new E(429,'Too many attempts. Try later.');
  const u=db.users.find(x=>x.email===String(body.email||'').trim().toLowerCase());
  if(!u||!u.active||!chk(u,String(body.password||''))){(fails[ip]=fails[ip]||[]).push(Date.now());throw new E(401,'Wrong email or password')}
  res.setHeader('Set-Cookie',`s=${token(u)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200${req.headers['x-forwarded-proto']==='https'?'; Secure':''}`);return pub(u)}
 if(m==='POST'&&p==='logout'){res.setHeader('Set-Cookie','s=; HttpOnly; Path=/; Max-Age=0');return{ok:1}}
 const u=who(req);if(!u)throw new E(401,'Please sign in');
 if(m==='GET'&&p==='me')return pub(u);
 if(m==='POST'&&p==='change-password'){if(!chk(u,String(body.current||'')))throw new E(400,'Current password is wrong');const n=str(body.password,100,8,'New password (min 8 chars)');
  if(n===body.current||['12345678','password','123456789','11111111'].includes(n))throw new E(400,'Choose a stronger, different password');Object.assign(u,mk(n));u.mustChange=false;save();return pub(u)}
 if(u.mustChange)throw new E(403,'Please change your password first');
 // ---------- MARKETER (own clients + own money only) ----------
 if(p==='m/summary'){need(u,'marketer');return{...money(u.id),rate:RATE,packages:PK,
  clients:db.clients.filter(c=>c.marketerId===u.id).map(c=>({id:c.id,name:c.name,package:c.package,commission:c.commission,createdAt:c.createdAt,installed:db.jobs.some(j=>j.clientId===c.id&&j.status==='done')})).reverse(),
  withdrawals:wd(u.id).slice().reverse()}}
 if(m==='POST'&&p==='m/clients'){need(u,'marketer');const pkg=String(body.package);if(!PK[pkg])throw new E(400,'Choose a package');
  const c={id:uid(),marketerId:u.id,name:str(body.name,80,2,'Name'),email:email(body.email),phone:phone(body.phone),location:str(body.location,160,2,'Location'),pin:pin(body.pin),package:pkg,price:PK[pkg],commission:Math.round(PK[pkg]*RATE),createdAt:Date.now()};
  db.clients.push(c);newJob({clientId:c.id,clientName:c.name,phone:c.phone,location:c.location,pin:c.pin,package:pkg,source:'marketer'});save();return{ok:1,commission:c.commission}}
 if(m==='POST'&&p==='m/withdraw'){need(u,'marketer');const a=Math.floor(+body.amount),mo=money(u.id);
  if(!(a>=1000))throw new E(400,'Minimum withdrawal is UGX 1,000');if(a>mo.available)throw new E(400,'Amount exceeds your available balance');
  db.withdrawals.push({id:uid(),marketerId:u.id,amount:a,payTo:phone(body.payTo),status:'pending',createdAt:Date.now()});save();return{ok:1}}
 // ---------- INSTALLER (only jobs assigned to them) ----------
 if(p==='i/jobs'){need(u,'installer');return db.jobs.filter(j=>j.installerId===u.id).map(({id,clientName,phone,location,pin,package:pk,status,notes,createdAt,completedAt,photos})=>({id,clientName,phone,location,pin,package:pk,status,notes,createdAt,completedAt,photos:photos.length})).reverse()}
 let x;if(m==='POST'&&(x=/^i\/jobs\/(\w+)\/(start|complete)$/.exec(p))){need(u,'installer');const j=db.jobs.find(j=>j.id===x[1]&&j.installerId===u.id);if(!j)throw new E(404,'Job not found');
  if(x[2]==='start'){if(j.status!=='assigned')throw new E(400,'Job cannot be started');j.status='in_progress';save();return{ok:1}}
  if(j.status==='done')throw new E(400,'Job already completed');if(!Array.isArray(body.photos)||body.photos.length!==2)throw new E(400,'Exactly 2 proof photos are required');
  const f=body.photos.map(img);j.photos=f.map((o,n)=>{const name=`${j.id}-${n}.${o.ext}`;fs.writeFileSync(path.join(DIR,'uploads',name),o.b);return name});
  j.notes=String(body.notes||'').slice(0,500);j.status='done';j.completedAt=Date.now();save();return{ok:1}}
 if(m==='GET'&&(x=/^photo\/(\w+)\/([01])$/.exec(p))){const j=db.jobs.find(j=>j.id===x[1]);if(!j||!j.photos[+x[2]]||!(u.role==='admin'||j.installerId===u.id))throw new E(404,'Not found');
  const f=j.photos[+x[2]];res.writeHead(200,{'Content-Type':{jpg:'image/jpeg',png:'image/png',webp:'image/webp'}[f.split('.').pop()],'Cache-Control':'private, max-age=3600'});return res.end(fs.readFileSync(path.join(DIR,'uploads',f))),'sent'}
 // ---------- ADMIN ----------
 if(p.startsWith('a/'))need(u,'admin');
 if(p==='a/overview'){const nm=id=>(db.users.find(x=>x.id===id)||{}).name||'';return{users:db.users.map(x=>({...pub(x),...(x.role==='marketer'?money(x.id):{}),clients:db.clients.filter(c=>c.marketerId===x.id).length})),
  clients:db.clients.map(c=>({...c,marketer:nm(c.marketerId)})).reverse(),jobs:db.jobs.map(j=>({...j,installer:nm(j.installerId)})).reverse(),
  withdrawals:db.withdrawals.map(w=>({...w,marketer:nm(w.marketerId)})).reverse(),packages:PK}}
 if(m==='POST'&&p==='a/users'){const role=String(body.role);if(!ROLES.includes(role))throw new E(400,'Invalid role');const pw=str(body.password,100,8,'Password (min 8 chars)'),em=email(body.email);
  if(db.users.some(x=>x.email===em))throw new E(400,'Email already in use');db.users.push({id:uid(),name:str(body.name,80,2,'Name'),email:em,phone:phone(body.phone),role,active:true,mustChange:true,...mk(pw)});save();return{ok:1}}
 if(m==='PATCH'&&(x=/^a\/users\/(\w+)$/.exec(p))){const t=db.users.find(y=>y.id===x[1]);if(!t)throw new E(404,'No such user');
  if(typeof body.active==='boolean'){if(t.id===u.id)throw new E(400,"You can't deactivate yourself");t.active=body.active}
  if(body.password){Object.assign(t,mk(str(body.password,100,8,'Password (min 8 chars)')));t.mustChange=true}save();return{ok:1}}
 if(m==='POST'&&p==='a/jobs'){const pkg=String(body.package);if(!PK[pkg])throw new E(400,'Choose a package');const j=newJob({clientName:str(body.clientName,80,2,'Client name'),phone:phone(body.phone),location:str(body.location,160,2,'Location'),pin:pin(body.pin),package:pkg,source:'admin'});
  if(body.installerId){const i=db.users.find(y=>y.id===body.installerId&&y.role==='installer'&&y.active);if(!i)throw new E(400,'Invalid installer');j.installerId=i.id;j.status='assigned'}save();return{ok:1}}
 if(m==='PATCH'&&(x=/^a\/jobs\/(\w+)$/.exec(p))){const j=db.jobs.find(y=>y.id===x[1]);if(!j)throw new E(404,'No such job');if(j.status==='done')throw new E(400,'Completed jobs are locked');
  const i=db.users.find(y=>y.id===body.installerId&&y.role==='installer'&&y.active);if(!i)throw new E(400,'Choose an active installer');j.installerId=i.id;if(j.status==='unassigned')j.status='assigned';save();return{ok:1}}
 if(m==='PATCH'&&(x=/^a\/withdrawals\/(\w+)$/.exec(p))){const w=db.withdrawals.find(y=>y.id===x[1]);if(!w||w.status!=='pending')throw new E(400,'Request is not pending');
  if(!['paid','rejected'].includes(body.status))throw new E(400,'Invalid status');w.status=body.status;w.resolvedAt=Date.now();save();return{ok:1}}
 throw new E(404,'Not found')}

const STATIC={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/script.js':'script.js','/portal':'portal.html','/portal.html':'portal.html','/portal.css':'portal.css','/portal.js':'portal.js'};
const MIME={html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript',svg:'image/svg+xml',jpg:'image/jpeg',png:'image/png',webp:'image/webp'};
const SEC={'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'same-origin'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://x');for(const k in SEC)res.setHeader(k,SEC[k]);
 if(url.pathname.startsWith('/api/')){res.setHeader('Cache-Control','no-store');let body={};
  if(req.method!=='GET'){if(!/application\/json/.test(req.headers['content-type']||''))throw new E(415,'JSON only');let s='',n=0;for await(const c of req){n+=c.length;if(n>7e6)throw new E(413,'Too large');s+=c}try{body=JSON.parse(s||'{}')}catch{throw new E(400,'Bad JSON')}}
  const out=await api(req,url,body,res);if(res.writableEnded)return;res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(out))}
 let f=STATIC[url.pathname];if(!f&&/^\/images\/[\w-]+\.(svg|jpg|png|webp)$/.test(url.pathname))f=url.pathname.slice(1);
 if(!f||!fs.existsSync(path.join(__dirname,f))){res.writeHead(404);return res.end('Not found')}
 if(f.startsWith('portal'))res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:");
 res.writeHead(200,{'Content-Type':MIME[f.split('.').pop()]});fs.createReadStream(path.join(__dirname,f)).pipe(res)}
catch(e){const c=e instanceof E?e.c:500;if(c===500)console.error(e);res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify({error:c===500?'Server error':e.message}))}}).listen(PORT,()=>console.log('Denop running on :'+PORT));
