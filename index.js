// 🎀 BABY BOT - FINAL INDEX | Baby Method 200 CMDS 🧸💗
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";

// 🎀 IMPORT ALL SYSTEMS
import "./database.js";
import "./session.js";
import "./media.js";
import { getPairCode } from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎀 CONFIG
const PREFIX = ".";
const OWNER_NUMBER = "2349166265317";
const BOT_NAME = "BABY BOT";
const IMAGE_URL = "https://files.catbox.moe/yvgx71.jpg";
const SESSION_PATH = "./session";

const app = express();
const PORT = process.env.PORT || 3000;

// 🎀 SERVER
app.get("/", (req, res) => res.send(`🎀 ${BOT_NAME} Active! 💗 200 CMDS | Pair: /getcode`));
app.get("/getcode", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// 🎀 PAIR CODE API
app.get("/code", async (req, res) => {
    const number = req.query.number;
    if (!number) return res.json({ error: "Add ?number=234..." });
    try {
        const code = await getPairCode(number);
        res.json({ code: code, status: "💗 Check WhatsApp for code" });
    } catch (e) {
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
        markOnlineOnConnect: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true);
            console.log("🎀 Reconnecting...", shouldReconnect);
            if (shouldReconnect) startBabyBot();
        } else if (connection === "open") {
            console.log(`💗 ${BOT_NAME} ONLINE! 200 Commands Ready! 🍼`);
        }
    });

    // 🎀 PLUGIN LOADER - 6 FOLDERS
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
        if (!body.startsWith(PREFIX)) return;

        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const text = args.join(" ");

        const meta = { command, args, text, from, PREFIX, OWNER_NUMBER, BOT_NAME, IMAGE_URL, isGroup, sock, m };

        try {
            for (const h of (plugins.owner||[])) await h(sock, m, meta);
            for (const h of (plugins.group||[])) await h(sock, m, meta);
            for (const h of (plugins.moderator||[])) await h(sock, m, meta);
            for (const h of (plugins.auto||[])) await h(sock, m, meta);
            for (const h of (plugins.anti||[])) await h(sock, m, meta);
            for (const h of (plugins.baby||[])) await h(sock, m, meta);

            // 🎀 MAIN MENU
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
            console.error("🎀 Error:", err);
        }
    });
}

startBabyBot();
