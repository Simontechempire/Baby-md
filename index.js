// 🎀 BABY BOT - INDEX FIXED - NO RACE, REPLY 100%
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, Browsers } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";
import { getPairCode } from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_PATH = path.join(__dirname, "auth_sess");
if(!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH,{recursive:true});

const PREFIX = ".";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{ 
    res.sendFile(path.join(__dirname, "index.html"), (err)=>{
        if(err) res.send(BOT_NAME + " Active! Go /code?number=234...");
    });
});
app.get("/code", async (req,res)=>{
    let number = (req.query.number || "").replace(/[^0-9]/g,"");
    if(!number) return res.json({error:"Add ?number=234..."});
    try{
        const code = await getPairCode(number);
        if(code === "ALREADY_REGISTERED") return res.json({code: "ALREADY LINKED ✅ BOT ONLINE"});
        res.json({code});
    }catch(e){ res.json({error:e.message}); }
});
app.listen(PORT, ()=>console.log("🎀 Server on " + PORT));

async function startBabyBot(){
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const sock = makeWASocket({ 
        version: [2,3000,1015901307],
        logger: P({level:"silent"}), 
        printQRInTerminal:false, 
        auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:"silent"})) }, 
        browser: Browsers.macOS("Safari"),
        markOnlineOnConnect:true,
        syncFullHistory:false,
        connectTimeoutMs: 30000,
        keepAliveIntervalMs: 10000
    });
    global.sock = sock;
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", async (update)=>{
        const { connection, lastDisconnect } = update;
        if(connection==="close"){
            let code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.status;
            const shouldReconnect = code !== DisconnectReason.loggedOut;
            console.log("Closed, reconnect?", shouldReconnect, code);
            if(shouldReconnect) setTimeout(startBabyBot,3000);
        }else if(connection==="open"){
            console.log("💗 BABY BOT ONLINE! 💗");
        }
    });
    
    sock.ev.on("messages.upsert", async ({messages})=>{
        try{
            const m=messages[0];
            if(!m?.message) return;
            if(m.key.fromMe) return;
            const from=m.key.remoteJid;
            const type=Object.keys(m.message)[0];
            let body = "";
            if(type==="conversation") body=m.message.conversation;
            else if(type==="extendedTextMessage") body=m.message.extendedTextMessage.text;
            else if(type==="imageMessage") body=m.message.imageMessage.caption||"";
            else if(type==="videoMessage") body=m.message.videoMessage.caption||"";
            if(!body) return;
            console.log(`📩 ${from}: ${body}`);
            if(!body.startsWith(PREFIX)) return;
            const args=body.slice(PREFIX.length).trim().split(/ +/);
            const command=args.shift().toLowerCase();
            if(command==="ping"){
                await sock.sendMessage(from, { text: `🎀 PONG! ${BOT_NAME} ACTIVE 💗\nSpeed: Fast` }, { quoted: m });
                return;
            }
            if(["menu","help"].includes(command)){
                await sock.sendMessage(from, { image:{url:IMAGE_URL}, caption:`🎀 ${BOT_NAME} MENU\nPrefix: ${PREFIX}\nTry ${PREFIX}ping` }, {quoted:m});
                return;
            }
        }catch(e){ console.log("msg err", e.message); }
    });
}
startBabyBot();
