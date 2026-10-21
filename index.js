// 🎀 BABY BOT - AUTO CREATE 200 PLUGINS 💗
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

// 🎀 AUTO CREATE ALL 200 PLUGINS IF MISSING
const PLUGIN_TEMPLATES = {
    Owner: ["menu","owner","restart","broadcast","setpp","setbio","join","leave","block","unblock","clearsession","eval","shell","ban","unban"],
    Group: ["tagall","hidetag","kick","add","promote","demote","group","link","revoke","setname","setdesc","mute","unmute","invite","poll","kickall","warn","resetwarn","antilink","antibadword","welcome","goodbye","setwelcome","setgoodbye","open","close","tag","getgroup","info","admins","request","approve","reject","setemoji","disappear","ephemeral","events","memlist","memadd"],
    Moderator: ["warn","delwarn","warnings","antilink","antibadword","antidelete","antiviewonce","antisticker","antiaudio","antivideo","antiphoto","antifake","antilocation","antibutton","antilist","anticall","antispam","antiflood","setwarn","resetwarn","modlist","addmod","delmod","listbadword","addbadword","delbadword","listlink","addlink","dellink","mute","unmute"],
    Auto: ["autostatus","autoread","autolike","autobio","autotype","autoreact","autosticker","autovoice","autotranslate","autoai","autowelcome","autogoodbye","autokick","autopromote","autodemote","autodelete","autoblock","autoanswer","autochat","autolevel","autogame","autotruth","autodare","autojoke","automeme","autoquote","autofact","autohoroscope","autoweather","autonews"],
    Anti: ["antilink1","antilink2","antilink3","antilink4","antilink5","antibad1","antibad2","antibad3","antibad4","antibad5","antidelete1","antidelete2","antidelete3","antispam1","antispam2","antiflood1","antiflood2","antiviewonce1","antiviewonce2","antiviewonce3","antifake1","antifake2","antifake3","antisticker1","antisticker2","anticall1","anticall2","antilocation1","antibutton1","antibutton2","antilist1","antilist2","antiaudio1","antivideo1","antiphoto1"],
    Baby: ["baby","ai","gpt","gemini","blackbox","imagine","sticker","toimg","tovideo","toaudio","toptt","tourl","play","song","video","apk","fb","ig","tt","ytmp3","ytmp4","tiktok","pinterest","google","lyrics","translate","calc","weather","news","meme","joke","quote","fact","truth","dare","ship","love","level","rank","profile","afk","delafk","ping","runtime","speed","alive","owner","donate","report","bug"]
};

for(const [cat, files] of Object.entries(PLUGIN_TEMPLATES)){
    for(const name of files){
        const filePath = path.join(__dirname, "plugins", cat, `${name}.js`);
        if(!fs.existsSync(filePath)){
            const code = `// 🎀 ${cat}/${name}.js - Auto Created 💗
export default async function(sock, m, meta){
    const { command, from, PREFIX } = meta;
    if(command !== "${name.toLowerCase()}") return;
    await sock.sendMessage(from, { text: "🎀 ${name} command active! 💗\\nPrefix: ${PREFIX}${name}" }, { quoted: m });
}
`;
            fs.writeFileSync(filePath, code);
            console.log(`🍼 Created: ${cat}/${name}.js`);
        }
    }
}

// HTML etc...
const HTML_PATHS = [path.join(__dirname, "index.html"), path.join(__dirname, "public", "index.html")];
const prettyHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>🎀 BABY BOT 💗</title><style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif}body{background:linear-gradient(135deg,#ffb6e6,#ff8ecf,#ff5bb5);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.card{background:white;border-radius:25px;padding:30px;max-width:400px;width:100%;box-shadow:0 15px 35px rgba(255,91,181,0.3);text-align:center;border:3px solid #ff8ecf}.logo{width:120px;height:120px;border-radius:50%;border:4px solid #ff5bb5;margin:0 auto 15px;object-fit:cover}h1{color:#ff2d95;font-size:28px;font-weight:700}button{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(90deg,#ff5bb5,#ff2d95);color:white;font-weight:700;cursor:pointer}.code-display{font-size:28px;letter-spacing:8px;font-weight:700;color:#ff2d95;margin:15px 0;background:white;padding:12px;border-radius:12px}</style></head><body><div class="card"><img src="https://files.catbox.moe/yvgx71.jpg" class="logo"><h1>🎀 BABY BOT 💗</h1><div style="margin:15px 0"><input type="text" id="number" placeholder="2349166265317" style="width:100%;padding:14px;border-radius:12px;border:2px solid #ffb6e6;text-align:center"><br><br><button onclick="getCode()">✨ GET CODE 💗</button><div id="result"></div></div></div><script>async function getCode(){const num=document.getElementById('number').value.trim();const resDiv=document.getElementById('result');if(!num) return resDiv.innerHTML='<p style=color:red>Enter number!</p>';resDiv.innerHTML='🧸 Generating...';try{const res=await fetch(\`/code?number=\${num}\`);const data=await res.json();if(data.code){resDiv.innerHTML=\`<div class=code-display>\${data.code}</div>\`;}else{resDiv.innerHTML=data.error;}}catch(e){resDiv.innerHTML='Server not ready';}}</script></body></html>`;

for(const hp of HTML_PATHS) if(!fs.existsSync(hp)) fs.writeFileSync(hp, prettyHTML);

const DB_PATH = path.join(__dirname, "database", "database.json");
const DEFAULT_DB = { antilink:{}, users:{ users:{}, banned:[], premium:["2349166265317"] }, groups:{}, baby:{}, owners:["2349166265317"] };
function loadDB(){ try{ if(!fs.existsSync(DB_PATH)){ fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB,null,2)); return DEFAULT_DB;} return JSON.parse(fs.readFileSync(DB_PATH,"utf-8")); }catch{ return DEFAULT_DB; } }
loadDB();

const PREFIX = ".";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{ for(const hp of HTML_PATHS) if(fs.existsSync(hp)) return res.sendFile(hp); res.send(`🎀 ${BOT_NAME} Active!`); });
app.get("/getcode", (req,res)=>{ for(const hp of HTML_PATHS) if(fs.existsSync(hp)) return res.sendFile(hp); res.send(`🎀 ${BOT_NAME} Active!`); });

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

app.listen(PORT, ()=>console.log(`🎀 Server on ${PORT} 💗`));

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
    
    const plugins={}; 
    const cats=["Owner","Group","Moderator","Auto","Anti","Baby"];
    for(const cat of cats){
        const catPath=path.join(__dirname,"plugins",cat);
        plugins[cat.toLowerCase()]=[];
        if(fs.existsSync(catPath)){
            const files = fs.readdirSync(catPath).filter(f=>f.endsWith(".js"));
            console.log(`📁 ${cat}: ${files.length} files`);
            for(const file of files){
                try{ 
                    const plugin=await import(`file://${path.join(catPath,file)}?update=${Date.now()}`); 
                    plugins[cat.toLowerCase()].push(plugin.default||plugin); 
                    console.log(`✅ ${cat}/${file}`); 
                }catch(e){ console.log(`❌ ${cat}/${file}: ${e.message}`); }
            }
        }
    }
    let total = 0; for(const cat of cats) total += plugins[cat.toLowerCase()].length;
    console.log(`🎀 TOTAL LOADED: ${total} PLUGINS 💗`);
    
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
            if(["menu","help","allmenu"].includes(command)){ await sock.sendMessage(from, { image:{url:IMAGE_URL}, caption:`🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 💗\nPrefix: ${PREFIX}\nTotal: ${total} Commands Ready!` }, {quoted:m}); }
        }catch(err){ console.error(err.message); }
    });
}
startBabyBot();
