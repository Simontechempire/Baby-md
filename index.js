// 🎀 BABY BOT - MAIN INDEX | 200 Commands | Baby Method 🧸
import makeWASocket, { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import P from "pino";
import express from "express";
import { fileURLToPath } from "url";

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

// 🎀 Keep Alive Server for Render/Railway
app.get("/", (req, res) => res.send(`🎀 ${BOT_NAME} is Active! 💗 | 200 Commands`));
app.get("/getcode", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.listen(PORT, () => console.log(`🎀 Server running on port ${PORT}`));

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

    // 🎀 Connection Handler
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true);
            console.log("🎀 Connection closed, reconnecting...", shouldReconnect);
            if (shouldReconnect) startBabyBot();
        } else if (connection === "open") {
            console.log(`💗 ${BOT_NAME} Connected! 200 Commands Loaded!`);
        }
    });

    // 🎀 PLUGIN LOADER - 6 MASTER FILES
    const pluginsPath = path.join(__dirname, "plugins");
    let plugins = {};
    
    if (fs.existsSync(pluginsPath)) {
        const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith(".js"));
        for (const file of files) {
            try {
                const plugin = await import(`./plugins/${file}?update=${Date.now()}`);
                plugins[file.replace(".js","").toLowerCase()] = plugin.default || plugin;
                console.log(`🧸 Loaded: ${file}`);
            } catch (e) {
                console.log(`❌ Failed ${file}:`, e.message);
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
                     type === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";
        
        if (!body.startsWith(PREFIX)) return;
        
        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const text = args.join(" ");

        // 🎀 CALL PLUGINS - All commands cooked inside 6 files
        try {
            // Owner
            if (plugins.owner) await plugins.owner(sock, m, { command, args, text, from, PREFIX, OWNER_NUMBER, BOT_NAME, IMAGE_URL });
            // Group
            if (plugins.group) await plugins.group(sock, m, { command, args, text, from, isGroup, PREFIX });
            // Moderator
            if (plugins.moderator) await plugins.moderator(sock, m, { command, args, text, from, PREFIX });
            // Auto
            if (plugins.auto) await plugins.auto(sock, m, { command, args, text, from, PREFIX });
            // Anti
            if (plugins.anti) await plugins.anti(sock, m, { command, args, text, from, PREFIX });
            // Baby (50 fun cmds)
            if (plugins.baby) await plugins.baby(sock, m, { command, args, text, from, PREFIX, BOT_NAME, IMAGE_URL });

            // Main Menu
            if (command === "menu" || command === "help" || command === "allmenu") {
                const menu = `🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 — 𝐅𝐔𝐋𝐋 𝐂𝐌𝐃 𝐌𝐄𝐍𝐔 💗🧸
WhatsApp Bot | Baby Method | 200 Commands
╭━━━〔 🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 🎀 〕━━━╮
┃ 🧸 Hello, Baby! 💗
┃ ✨ Welcome to Baby Bot!
┃ 👑 Owner      │ 15 Commands
┃ 👥 Group      │ 40 Commands
┃ 🛡️ Moderator  │ 30 Commands
┃ 🤖 Auto       │ 30 Commands
┃ 🚫 Anti       │ 35 Commands
┃ 👶 Baby        │ 50 Commands
┃ 📚 Total: 200 Commands
┃ 💗 Prefix: ${PREFIX}
╰━━━━━━━━━━━━━━━━━━━━╯
       💗 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 💗
╭━━━━━━━━━━━━━━━━━━━━╮
┃ 👑 .ownermenu
┃ 👥 .groupmenu
┃ 🛡️ .modmenu
┃ 🤖 .automenu
┃ 🚫 .antimenu
┃ 👶 .babymenu
┃ 📚 .allmenu
┃ ⚙️ .settings
╰━━━━━━━━━━━━━━━━━━━━╯
🎀 Made with 💗 by Simon tech`;

                await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: menu }, { quoted: m });
            }

        } catch (err) {
            console.error("🎀 Plugin Error:", err);
        }
    });
}

startBabyBot();
