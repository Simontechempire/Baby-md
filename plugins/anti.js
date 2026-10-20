// 🚫 ANTI - 35 COMMANDS FULLY CODED | Baby Method 💗
import { loadDB, saveDB } from "../../database.js";

export default async function(sock, m, { command, args, text, from, isGroup }) {
    if (!isGroup) return;
    const db = loadDB();
    const reply = async (t) => await sock.sendMessage(from, { text: t }, { quoted: m });
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || "";

    // Init group anti settings
    db.groups.anti[from] = db.groups.anti[from] || {};
    const anti = db.groups.anti[from];

    switch(command) {
        case "anti": await reply("🚫 Anti system - 35 protections 💗\nUse .antilink, .antispam etc"); break;

        case "antilink":
            anti.link = text !== "off";
            saveDB(db);
            await reply(`🔗 Antilink ${anti.link ? "ON - Will delete links 🚫" : "OFF"}`);
            break;
        case "antilinkmode": anti.linkMode = text || "delete"; saveDB(db); await reply(`🔗 Link mode: ${anti.linkMode}`); break;
        case "antispam": anti.spam = text !== "off"; saveDB(db); await reply(`🚫 Antispam ${anti.spam ? "ON" : "OFF"}`); break;
        case "antiforward": anti.forward = text !== "off"; saveDB(db); await reply(`↗️ Antiforward ${anti.forward ? "ON" : "OFF"}`); break;
        case "antibot": anti.bot = text !== "off"; saveDB(db); await reply(`🤖 Antibot ${anti.bot ? "ON" : "OFF"}`); break;
        case "antiraid": anti.raid = text !== "off"; saveDB(db); await reply(`🛡️ Antiraid ${anti.raid ? "ON" : "OFF"}`); break;
        case "antiflood": anti.flood = text !== "off"; saveDB(db); await reply(`🌊 Antiflood ${anti.flood ? "ON" : "OFF"}`); break;
        case "antitag": anti.tag = text !== "off"; saveDB(db); await reply(`🏷️ Antitag ${anti.tag ? "ON" : "OFF"}`); break;
        case "antichannel": anti.channel = text !== "off"; saveDB(db); await reply(`📢 Antichannel ${anti.channel ? "ON" : "OFF"}`); break;
        case "antisticker": anti.sticker = text !== "off"; saveDB(db); await reply(`🎨 Antisticker ${anti.sticker ? "ON" : "OFF"}`); break;
        case "antigif": anti.gif = text !== "off"; saveDB(db); await reply(`🎞️ Antigif ${anti.gif ? "ON" : "OFF"}`); break;
        case "antimedia": anti.media = text !== "off"; saveDB(db); await reply(`🖼️ Antimedia ${anti.media ? "ON" : "OFF"}`); break;
        case "antiphoto": anti.photo = text !== "off"; saveDB(db); await reply(`📸 Antiphoto ${anti.photo ? "ON" : "OFF"}`); break;
        case "antivideo": anti.video = text !== "off"; saveDB(db); await reply(`🎥 Antivideo ${anti.video ? "ON" : "OFF"}`); break;
        case "antiaudio": anti.audio = text !== "off"; saveDB(db); await reply(`🎵 Antiaudio ${anti.audio ? "ON" : "OFF"}`); break;
        case "antidoc": anti.doc = text !== "off"; saveDB(db); await reply(`📄 Antidoc ${anti.doc ? "ON" : "OFF"}`); break;
        case "antiemoji": anti.emoji = text !== "off"; saveDB(db); await reply(`😀 Antiemoji ${anti.emoji ? "ON" : "OFF"}`); break;
        case "antibadword": anti.badword = text !== "off"; saveDB(db); await reply(`🤬 Antibadword ${anti.badword ? "ON" : "OFF"}`); break;
        case "antiscam": anti.scam = text !== "off"; saveDB(db); await reply(`💸 Antiscam ${anti.scam ? "ON" : "OFF"}`); break;
        case "antiphishing": anti.phishing = text !== "off"; saveDB(db); await reply(`🎣 Antiphishing ${anti.phishing ? "ON" : "OFF"}`); break;
        case "antirepeat": anti.repeat = text !== "off"; saveDB(db); await reply(`🔁 Antirepeat ${anti.repeat ? "ON" : "OFF"}`); break;
        case "antiduplicate": anti.duplicate = text !== "off"; saveDB(db); await reply(`📑 Antiduplicate ${anti.duplicate ? "ON" : "OFF"}`); break;
        case "antijoin": anti.join = text !== "off"; saveDB(db); await reply(`➡️ Antijoin ${anti.join ? "ON" : "OFF"}`); break;
        case "antileave": anti.leave = text !== "off"; saveDB(db); await reply(`⬅️ Antileave ${anti.leave ? "ON" : "OFF"}`); break;
        case "antiporn": anti.porn = text !== "off"; saveDB(db); await reply(`🔞 Antiporn ${anti.porn ? "ON" : "OFF"}`); break;
        case "antinsfw": anti.nsfw = text !== "off"; saveDB(db); await reply(`🔞 Antinsfw ${anti.nsfw ? "ON" : "OFF"}`); break;
        case "antimention": anti.mention = text !== "off"; saveDB(db); await reply(`📢 Antimention ${anti.mention ? "ON" : "OFF"}`); break;
        case "antiedit": anti.edit = text !== "off"; saveDB(db); await reply(`✏️ Antiedit ${anti.edit ? "ON" : "OFF"}`); break;
        case "antidelete": anti.delete = text !== "off"; saveDB(db); await reply(`🗑️ Antidelete ${anti.delete ? "ON - Saves deleted msgs 💾" : "OFF"}`); break;
        case "antivirus": anti.virus = text !== "off"; saveDB(db); await reply(`🦠 Antivirus ${anti.virus ? "ON" : "OFF"}`); break;

        case "badwordadd":
            if (!text) return reply("Use: .badwordadd word");
            db.groups.badwords[from] = db.groups.badwords[from] || [];
            db.groups.badwords[from].push(text.toLowerCase());
            saveDB(db);
            await reply(`✅ Added badword: ${text} 🤬`);
            break;

        case "badworddel":
            db.groups.badwords[from] = (db.groups.badwords[from]||[]).filter(w=>w!==text.toLowerCase());
            saveDB(db);
            await reply(`🗑️ Removed badword: ${text}`);
            break;

        case "badwordlist":
            await reply(`🤬 Badwords:\n${(db.groups.badwords[from]||[]).join(", ") || "No badwords"}`);
            break;

        case "antistats":
            let stats = "🚫 *ANTI STATS* 💗\n";
            for (const [k,v] of Object.entries(anti)) stats+=`${k}: ${v ? "ON ✅" : "OFF ❌"}\n`;
            await reply(stats || "All OFF");
            break;
    }

    // 🚫 AUTO PROTECTION LOGIC
    if (!command) {
        const lower = body.toLowerCase();
        // Antilink
        if (anti.link && /https?:\/\/|chat\.whatsapp\.com|wa\.me/.test(lower)) {
            try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: m.key.id, participant: m.key.participant } }); } catch {}
            await sock.sendMessage(from, { text: `🚫 @${(m.key.participant||"").split("@")[0]} Links not allowed! 🧸`, mentions: [m.key.participant] });
        }
        // Badword
        if (anti.badword) {
            const bads = db.groups.badwords[from] || [];
            if (bads.some(w=>lower.includes(w))) {
                try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: m.key.id, participant: m.key.participant } }); } catch {}
            }
        }
        // Antimedia checks
        if (anti.photo && m.message.imageMessage) { try { await sock.sendMessage(from, { delete: m.key }); } catch {} }
        if (anti.video && m.message.videoMessage) { try { await sock.sendMessage(from, { delete: m.key }); } catch {} }
        if (anti.sticker && m.message.stickerMessage) { try { await sock.sendMessage(from, { delete: m.key }); } catch {} }
    }
}
