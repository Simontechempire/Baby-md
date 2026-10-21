// 🎀 BABY BOT - FINAL FIXED - NO ENOENT 🎀
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDir(p){
    if(fs.existsSync(p)){
        try{ if(!fs.statSync(p).isDirectory()) fs.unlinkSync(p); }catch{}
    }
    if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true});
}

const SESSION_PATH = path.join(__dirname, "auth_sess");
ensureDir(SESSION_PATH);
ensureDir(path.join(__dirname, "database"));
ensureDir(path.join(__dirname, "public"));
ensureDir(path.join(__dirname, "plugins"));
for(const c of ["Owner","Group","Moderator","Auto","Anti","Baby"]) ensureDir(path.join(__dirname, "plugins", c));

// 🎀 AUTO CREATE BOTH HTML LOCATIONS
const HTML_PATHS = [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "public", "index.html")
];

const prettyHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>🎀 BABY BOT - Pair Code 💗</title><style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif}body{background:linear-gradient(135deg,#ffb6e6,#ff8ecf,#ff5bb5);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.card{background:white;border-radius:25px;padding:30px;max-width:400px;width:100%;box-shadow:0 15px 35px rgba(255,91,181,0.3);text-align:center;border:3px solid #ff8ecf}.logo{width:120px;height:120px;border-radius:50%;border:4px solid #ff5bb5;margin:0 auto 15px;object-fit:cover}h1{color:#ff2d95;font-size:28px;font-weight:700;margin-bottom:5px}.sub{color:#ff8ecf;font-size:14px;margin-bottom:20px;font-weight:600}.box{background:#fff0f7;border:2px dashed #ff8ecf;border-radius:15px;padding:15px;margin:15px 0}input{width:100%;padding:14px;border-radius:12px;border:2px solid #ffb6e6;outline:none;font-size:15px;text-align:center;margin-bottom:12px}input:focus{border-color:#ff5bb5}button{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(90deg,#ff5bb5,#ff2d95);color:white;font-weight:700;font-size:16px;cursor:pointer}button:hover{transform:scale(1.02)}.code-display{font-size:28px;letter-spacing:8px;font-weight:700;color:#ff2d95;margin:15px 0;background:white;padding:12px;border-radius:12px;border:2px solid #ff8ecf}.footer{margin-top:20px;font-size:12px;color:#ff8ecf}.badge{display:inline-block;background:#ff5bb5;color:white;padding:4px 12px;border-radius:20px;font-size:11px;margin:3px}</style></head><body><div class="card"><img src="https://files.catbox.moe/yvgx71.jpg" class="logo" alt="BABY BOT"><h1>🎀 BABY BOT 💗</h1><div class="sub">WhatsApp Bot | 200 Commands | Baby Method 🧸</div><div><span class="badge">👑 15 Owner</span><span class="badge">👥 40 Group</span><span class="badge">🛡️ 30 Mod</span><span class="badge">🤖 30 Auto</span><span class="badge">🚫 35 Anti</span><span class="badge">👶 50 Baby</span></div><div class="box"><p style="color:#ff5bb5;font-weight:600;margin-bottom:10px">🔐 Get Pair Code</p><input type="text" id="number" placeholder="2349166265317 (without +)"><button onclick="getCode()">✨ GET CODE 💗</button><div id="result"></div></div><div class="box" style="text-align:left;font-size:13px;color:#ff5bb5"><b>📚 How to link:</b><br>1. Enter number → Get Code<br>2. Open WhatsApp → Linked Devices<br>3. Link with Phone Number → Paste Code<br>4. BABY BOT is online! 🎀</div><div class="footer">Made with 💗 by Simon tech<br>Prefix: . | Total: 200 Commands</div></div><script>async function getCode(){const num=document.getElementById('number').value.trim();const resDiv=document.getElementById('result');if(!num) return resDiv.innerHTML='<p style="color:red">Enter number!</p>';resDiv.innerHTML='<p style="color:#ff5bb5">🧸 Generating code... 💗</p>';try{const res=await fetch(\`/code?number=\${num}\`);const data=await res.json();if(data.code){resDiv.innerHTML=\`<div class="code-display">\${data.code}</div><p style="color:#ff5bb5;font-size:13px">Copy this code in WhatsApp 🍼</p>\`;}else{resDiv.innerHTML=\`<p style="color:red">\${data.error||'Failed'}</p>\`;}}catch(e){resDiv.innerHTML='<p style="color:red">Server not ready</p>';}}</script></body></html>`;

for(const hp of HTML_PATHS){
    if(!fs.existsSync(hp)){
        fs.writeFileSync(hp, prettyHTML);
        console.log(`🎀 Created ${hp}`);
    }
}

const DB_PATH = path.join(__dirname, "database", "database.json");
const DEFAULT_DB = { antilink:{}, users:{ users:{}, banned:[], premium:["2349166265317"] }, groups:{}, baby:{}, owners:["2349166265317"] };
function loadDB(){ try{ if(!fs.existsSync(DB_PATH)){ fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB,null,2)); return DEFAULT_DB;} return JSON.parse(fs.readFileSync(DB_PATH,"utf-8")); }catch{ return DEFAULT_DB; } }
loadDB();

const PREFIX = ".";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const app = express();
const PORT = process.env.PORT || 3000;

// 🎀 FIXED - CHECKS BOTH LOCATIONS
app.get("/", (req,res)=>{
    for(const hp of HTML_PATHS) if(fs.existsSync(hp)) return res.sendFile(hp);
    res.send(`🎀 ${BOT_NAME} Active! 💗`);
});
app.get("/getcode", (req,res)=>{
    for(const hp of HTML_PATHS) if(fs.existsSync(hp)) return res.sendFile(hp);
    res.send(`🎀 ${BOT_NAME} Active! 💗`);
});

app.get("/code", async (req,res)=>{
    let number = req.query.number?.replace(/[^0-9]/g,"")||"";
    if(!number) return res.json({error:"Add ?number=234..."});
    try{
        const { state } = await useMultiFileAuthState(SESSION_PATH);
        const sock = makeWASocket({ logger: P({level:"silent"}), printQRInTerminal:false, auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:"silent"})) }, browser:["BABY BOT","Chrome","1.0.0"] });
        await new Promise(r=>setTimeout(r,2000));
        let code = await sock.requestPairingCode(number);
        code = code?.match(/.{1,4}/g)?.join("-")||code;
        res.json({code});
        setTimeout(()=>{ try{ sock.ws.close(); }catch{} }, 5000);
    }catch(e){ res.json({error:e.message}); }
});

app.listen(PORT, ()=>console.log(`🎀 Server on ${PORT} - HTML Ready 💗`));

async function startBabyBot(){
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, logger: P({level:"silent"}), printQRInTerminal:false, auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:"silent"})) }, browser:["BABY BOT","Chrome","1.0.0"], markOnlineOnConnect:true });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", async (update)=>{
        const { connection, lastDisconnect } = update;
        if(connection==="close"){
            const shouldReconnect = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            if(shouldReconnect) setTimeout(startBabyBot,3000);
        }else if(connection==="open"){ console.log(`💗 ${BOT_NAME} ONLINE! 🍼`); }
    });
    const plugins={}; const cats=["Owner","Group","Moderator","Auto","Anti","Baby"];
    for(const cat of cats){
        const catPath=path.join(__dirname,"plugins",cat);
        plugins[cat.toLowerCase()]=[];
        if(fs.existsSync(catPath)){
            for(const file of fs.readdirSync(catPath).filter(f=>f.endsWith(".js"))){
                try{ const plugin=await import(`./plugins/${cat}/${file}?update=${Date.now()}`); plugins[cat.toLowerCase()].push(plugin.default||plugin); console.log(`🧸 Loaded: ${cat}/${file}`); }catch(e){ console.log(`❌ ${cat}/${file}: ${e.message}`); }
            }
        }
    }
    sock.ev.on("messages.upsert", async ({messages})=>{
        const m=messages[0];
        if(!m.message||m.key.fromMe) return;
        const from=m.key.remoteJid;
        const type=Object.keys(m.message)[0];
        const body= type==="conversation"?m.message.conversation: type==="extendedTextMessage"?m.message.extendedTextMessage.text: type==="imageMessage"?m.message.imageMessage.caption||"": type==="videoMessage"?m.message.videoMessage.caption||"": "";
        if(!body||!body.startsWith(PREFIX)) return;
        const args=body.slice(PREFIX.length).trim().split(/ +/);
        const command=args.shift().toLowerCase();
        const meta={ command, args, text:args.join(" "), from, PREFIX, BOT_NAME, IMAGE_URL, isGroup:from.endsWith("@g.us"), sock, m, loadDB };
        try{
            for(const cat of cats) for(const h of (plugins[cat.toLowerCase()]||[])) if(typeof h==='function') await h(sock,m,meta);
            if(["menu","help","allmenu"].includes(command)){ await sock.sendMessage(from, { image:{url:IMAGE_URL}, caption:`🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 💗\nPrefix: ${PREFIX}\n200 Commands Ready!` }, {quoted:m}); }
        }catch(err){ console.error(err.message); }
    });
}
startBabyBot();
