// 🎀 BABY BOT - ZERO IMPORT ERROR VERSION 💗
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎀 AUTO CREATE EVERYTHING - NO IMPORTS NEEDED
for (const f of ["session", "media", "database", "plugins", "plugins/Owner", "plugins/Group", "plugins/Moderator", "plugins/Auto", "plugins/Anti", "plugins/Baby"]) {
    const p = path.join(__dirname, f);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// 🎀 INLINE DATABASE - NO database.js NEEDED!
const DB_PATH = path.join(__dirname, "database", "database.json");
const DEFAULT_DB = {
  antilink: {}, antibadword: {}, antidelete: {},
  warnings: { groups: {} },
  users: { users: {}, banned: [], premium: ["2349166265317"], afk: {} },
  groups: { groups: {}, anti: {}, badwords: {}, welcome: {}, settings: {} },
  baby: { active: {}, settings: { prefix: ".", botName: "BABY BOT", owner: "2349166265317" } },
  owners: ["2349166265317"]
};
function loadDB() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
            return DEFAULT_DB;
        }
        return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch { return DEFAULT_DB; }
}
function saveDB(d) {
    try { fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2)); } catch {}
}
loadDB();

// 🎀 CONFIG
const PREFIX = ".";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const SESSION_PATH = path.join(__dirname, "session");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send(`🎀 ${BOT_NAME} Active! 💗`));
app.get("/getcode", (req, res) => {
    res.send(`<html><head><title>Pair</title><style>body{background:#ff69b4;color:white;text-align:center;font-family:sans-serif;padding:50px}input{padding:15px;border-radius:20px;border:none;width:250px}button{padding:15px 30px;border-radius:20px;border:none;background:white;color:#ff69b4;font-weight:bold;margin-top:10px;cursor:pointer}</style></head><body><h1>🎀 BABY BOT PAIR 💗</h1><input id="num" placeholder="2349166265317" /><br><button onclick="getCode()">Get Code 🍼</button><h2 id="code"></h2><script>async function getCode(){document.getElementById('code').innerText='⏳...';let n=document.getElementById('num').value;let r=await fetch('/code?number='+n);let d=await r.json();document.getElementById('code').innerText=d.code||d.error;}</script></body></html>`);
});

app.get("/code", async (req, res) => {
    let number = req.query.number?.replace(/[^0-9]/g, "") || "";
    if (!number) return res.json({ error: "Add ?number=234..." });
    try {
        const { state } = await useMultiFileAuthState(SESSION_PATH);
        const sock = makeWASocket({ logger: P({ level: "silent" }), printQRInTerminal: false, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })) }, browser: ["BABY BOT", "Chrome", "1.0.0"] });
        await new Promise(r => setTimeout(r, 2000));
        let code = await sock.requestPairingCode(number);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        res.json({ code });
        setTimeout(() => { try { sock.ws.close(); } catch {} }, 5000);
    } catch (e) { res.json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`🎀 Server on ${PORT}`));

async function startBabyBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, logger: P({ level: "silent" }), printQRInTerminal: false, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })) }, browser: ["BABY BOT", "Chrome", "1.0.0"], markOnlineOnConnect: true });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            if (shouldReconnect) setTimeout(startBabyBot, 3000);
        } else if (connection === "open") {
            console.log(`💗 ${BOT_NAME} ONLINE! 🍼`);
        }
    });

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
        }
    }

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;
        const from = m.key.remoteJid;
        const type = Object.keys(m.message)[0];
        const body = type === "conversation" ? m.message.conversation : type === "extendedTextMessage" ? m.message.extendedTextMessage.text : type === "imageMessage" ? m.message.imageMessage.caption || "" : type === "videoMessage" ? m.message.videoMessage.caption || "" : "";
        if (!body || !body.startsWith(PREFIX)) return;
        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const text = args.join(" ");
        const meta = { command, args, text, from, PREFIX, BOT_NAME, IMAGE_URL, isGroup: from.endsWith("@g.us"), sock, m, loadDB, saveDB };
        try {
            for (const cat of categories) for (const h of (plugins[cat.toLowerCase()]||[])) if (typeof h === 'function') await h(sock, m, meta);
            if (["menu","help","allmenu"].includes(command)) {
                await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: `🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 💗\nPrefix: ${PREFIX}\n200 Commands Ready!` }, { quoted: m });
            }
        } catch (err) { console.error(err.message); }
    });
}
startBabyBot();
