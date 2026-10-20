// 🎀 BABY BOT - FINAL INDEX | Baby Method 200 CMDS 🧸💗 | NO CRASH VERSION
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";
import { loadDB } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎀 AUTO CREATE REQUIRED FOLDERS (fixes your error)
if (!fs.existsSync(path.join(__dirname, "session"))) fs.mkdirSync(path.join(__dirname, "session"), { recursive: true });
if (!fs.existsSync(path.join(__dirname, "media"))) fs.mkdirSync(path.join(__dirname, "media"), { recursive: true });
if (!fs.existsSync(path.join(__dirname, "database"))) fs.mkdirSync(path.join(__dirname, "database"), { recursive: true });
if (!fs.existsSync(path.join(__dirname, "plugins"))) fs.mkdirSync(path.join(__dirname, "plugins"), { recursive: true });

// 🎀 CONFIG
const PREFIX = ".";
const OWNER_NUMBER = "2349166265317";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const SESSION_PATH = path.join(__dirname, "session");

const app = express();
const PORT = process.env.PORT || 3000;

// 🎀 SERVER
app.get("/", (req, res) => res.send(`🎀 ${BOT_NAME} Active! 💗 200 CMDS | Pair: /getcode`));

// 🎀 PAIR CODE PAGE (inline HTML - no index.html needed)
app.get("/getcode", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html><head><title>BABY BOT Pair</title>
<style>body{background:#ff69b4;color:white;text-align:center;font-family:sans-serif;padding:50px}input{padding:15px;border-radius:20px;border:none;width:250px}button{padding:15px 30px;border-radius:20px;border:none;background:white;color:#ff69b4;font-weight:bold;margin-top:10px;cursor:pointer}#code{font-size:32px;background:white;color:#ff69b4;padding:20px;border-radius:20px;margin-top:20px;display:inline-block}</style>
</head><body>
<h1>🎀 BABY BOT PAIR 💗</h1>
<p>Enter WhatsApp number with country code</p>
<input id="num" placeholder="2349166265317" />
<br><button onclick="getCode()">Get Code 🍼</button>
<h2 id="code"></h2>
<p id="msg"></p>
<script>
async function getCode(){
 document.getElementById('code').innerText='⏳ Generating...';
 let n=document.getElementById('num').value;
 if(!n) return alert('Enter number');
 let r=await fetch('/code?number='+n);
 let d=await r.json();
 document.getElementById('code').innerText=d.code||'Error';
 document.getElementById('msg').innerText=d.status||d.error||'';
}
</script></body></html>
    `);
});

// 🎀 PAIR CODE API - FIXED
app.get("/code", async (req, res) => {
    let number = req.query.number;
    if (!number) return res.json({ error: "Add ?number=234..." });
    try {
        number = number.replace(/[^0-9]/g, "");
        const { state } = await useMultiFileAuthState(SESSION_PATH);
        const sock = makeWASocket({
            logger: P({ level: "silent" }),
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
            },
            browser: ["BABY BOT", "Chrome", "1.0.0"]
        });
        await new Promise(r => setTimeout(r, 2000));
        let code = await sock.requestPairingCode(number);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        res.json({ code: code, status: "💗 Check WhatsApp > Linked Devices > Enter Code" });
        setTimeout(() => { try { sock.ws.close(); } catch {} }, 5000);
    } catch (e) {
        console.log("Pair error:", e.message);
        res.json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`🎀 Server on ${PORT} | Pair at /getcode 💗`));

// 🎀 START BOT
async function startBabyBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
        },
        browser: ["BABY BOT", "Chrome", "1.0.0"],
        markOnlineOnConnect: true,
        syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log("🎀 Reconnecting...", shouldReconnect);
            if (shouldReconnect) setTimeout(startBabyBot, 3000);
        } else if (connection === "open") {
            console.log(`💗 ${BOT_NAME} ONLINE! 200 Commands Ready! 🍼`);
            // Load DB
            loadDB();
        }
    });

    // 🎀 PLUGIN LOADER - SAFE
    const plugins = {};
    const categories = ["Owner","Group","Moderator","Auto","Anti","Baby"];
    for (const cat of categories) {
        const catPath = path.join(__dirname, "plugins", cat);
        plugins[cat.toLowerCase()] = [];
        if (fs.existsSync(catPath)) {
            const files = fs.readdirSync(catPath).filter(f => f.endsWith(".js"));
            for (const file of files) {
                try {
                    const plugin = await import(`./plugins/${cat}/${file}?update=${Date.now()}`);
                    plugins[cat.toLowerCase()].push(plugin.default || plugin);
                    console.log(`🧸 Loaded: ${cat}/${file}`);
                } catch (e) { console.log(`❌ ${cat}/${file}: ${e.message}`); }
            }
        } else {
            console.log(`⚠️ No folder: ${cat}`);
        }
    }

    // 🎀 MESSAGE HANDLER
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const type = Object.keys(m.message)[0];
        const body = type === "conversation" ? m.message.conversation : 
                     type === "extendedTextMessage" ? m.message.extendedTextMessage.text :
                     type === "imageMessage" ? m.message.imageMessage.caption || "" : 
                     type === "videoMessage" ? m.message.videoMessage.caption || "" : "";
        if (!body || !body.startsWith(PREFIX)) return;

        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const text = args.join(" ");

        const meta = { command, args, text, from, PREFIX, OWNER_NUMBER, BOT_NAME, IMAGE_URL, isGroup, sock, m };

        try {
            for (const h of (plugins.owner||[])) if (typeof h === 'function') await h(sock, m, meta);
            for (const h of (plugins.group||[])) if (typeof h === 'function') await h(sock, m, meta);
            for (const h of (plugins.moderator||[])) if (typeof h === 'function') await h(sock, m, meta);
            for (const h of (plugins.auto||[])) if (typeof h === 'function') await h(sock, m, meta);
            for (const h of (plugins.anti||[])) if (typeof h === 'function') await h(sock, m, meta);
            for (const h of (plugins.baby||[])) if (typeof h === 'function') await h(sock, m, meta);

            if (["menu","help","allmenu"].includes(command)) {
                const menuText = `🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 — 𝐅𝐔𝐋𝐋 𝐌𝐄𝐍𝐔 💗🧸
╭━━━〔 🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 🎀 〕━━━╮
┃ 🧸 Baby! 💗
┃ 📚 200 Commands
┃ 💗 Prefix: ${PREFIX}
╰━━━━━━━━━━━━━━━━━━━━╯
╭━━━ 💗 MAIN 💗 ━━━╮
┃ 👑 .ownermenu - 15
┃ 👥 .groupmenu - 40
┃ 🛡️ .modmenu - 30
┃ 🤖 .automenu - 30
┃ 🚫 .antimenu - 35
┃ 👶 .babymenu - 50
┃ 📚 .allmenu
╰━━━━━━━━━━━━━━━━━━━━╯
🎀 By Simon Tech 💗`;
                await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: menuText }, { quoted: m });
            }
        } catch (err) {
            console.error("🎀 Error:", err.message);
        }
    });
}

startBabyBot();
