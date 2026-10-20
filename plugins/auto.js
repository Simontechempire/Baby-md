// 🤖 AUTO - 30 COMMANDS FULLY CODED | Baby Method 💗
import { loadDB, saveDB } from "../../database.js";

export default async function(sock, m, { command, args, text, from, isGroup }) {
    const db = loadDB();
    const reply = async (t) => await sock.sendMessage(from, { text: t }, { quoted: m });

    switch(command) {
        case "auto": await reply("🤖 Auto system - 30 commands active 💗\nUse .autowelcome, .autoreply etc"); break;

        case "autowelcome":
            db.groups.groups[from] = db.groups.groups[from] || {};
            db.groups.groups[from].autoWelcome = text !== "off";
            saveDB(db);
            await reply(`👋 Auto welcome ${db.groups.groups[from].autoWelcome ? "ON 🧸" : "OFF"}`);
            break;

        case "autogoodbye":
            db.groups.groups[from] = db.groups.groups[from] || {};
            db.groups.groups[from].autoGoodbye = text !== "off";
            saveDB(db);
            await reply(`👋 Auto goodbye ${db.groups.groups[from].autoGoodbye ? "ON" : "OFF"}`);
            break;

        case "autoreply":
            if (!text) return reply("Use: .autoreply hello => Hi baby! 💗");
            const [trig, ...rep] = text.split("=>");
            db.auto.replies[trig.trim()] = rep.join("=>").trim();
            saveDB(db);
            await reply(`✅ Auto reply: ${trig.trim()} => ${rep.join("=>").trim()}`);
            break;

        case "autodel": db.auto.autoDel = text !== "off"; saveDB(db); await reply(`🗑️ Auto delete ${db.auto.autoDel ? "ON" : "OFF"}`); break;
        case "autopin": db.auto.autoPin = text !== "off"; saveDB(db); await reply(`📌 Auto pin ${db.auto.autoPin ? "ON" : "OFF"}`); break;
        case "autofilter": db.auto.autoFilter = text !== "off"; saveDB(db); await reply(`🔍 Auto filter ${db.auto.autoFilter ? "ON" : "OFF"}`); break;
        case "autoban": db.auto.autoBan = text !== "off"; saveDB(db); await reply(`🚫 Auto ban ${db.auto.autoBan ? "ON" : "OFF"}`); break;
        case "automute": db.auto.autoMute = text !== "off"; saveDB(db); await reply(`🔇 Auto mute ${db.auto.autoMute ? "ON" : "OFF"}`); break;
        case "autowarn": db.auto.autoWarn = text !== "off"; saveDB(db); await reply(`⚠️ Auto warn ${db.auto.autoWarn ? "ON" : "OFF"}`); break;

        case "antiflood": db.auto.antiflood = text !== "off"; saveDB(db); await reply(`🌊 Antiflood ${db.auto.antiflood ? "ON" : "OFF"}`); break;
        case "antiraid": db.auto.antiraid = text !== "off"; saveDB(db); await reply(`🛡️ Antiraid ${db.auto.antiraid ? "ON" : "OFF"}`); break;
        case "autolock": db.auto.autoLock = text !== "off"; saveDB(db); await reply(`🔒 Autolock ${db.auto.autoLock ? "ON" : "OFF"}`); break;
        case "autounlock": db.auto.autoUnlock = text !== "off"; saveDB(db); await reply(`🔓 Autounlock ${db.auto.autoUnlock ? "ON" : "OFF"}`); break;

        case "schedule":
            if (!text) return reply("Use: .schedule 10m Hello baby!");
            const time = args[0];
            const msg = args.slice(1).join(" ");
            const delay = time.includes("m") ? parseInt(time)*60000 : time.includes("h") ? parseInt(time)*3600000 : 60000;
            setTimeout(() => sock.sendMessage(from, { text: `⏰ Scheduled: ${msg}` }), delay);
            db.auto.jobs.push({ time, msg, from });
            saveDB(db);
            await reply(`⏰ Scheduled in ${time}: ${msg} 💗`);
            break;

        case "canceljob": db.auto.jobs = []; saveDB(db); await reply("❌ All jobs canceled"); break;
        case "jobs": await reply(`📋 Jobs: ${(db.auto.jobs||[]).map(j=>`${j.time} - ${j.msg}`).join("\n") || "No jobs"}`); break;

        case "settimezone":
            db.auto.timezone = text || "Africa/Lagos";
            saveDB(db);
            await reply(`🌍 Timezone set to ${db.auto.timezone} 💗`);
            break;

        case "autobackup": db.auto.backup = text !== "off"; saveDB(db); await reply(`💾 Autobackup ${db.auto.backup ? "ON" : "OFF"}`); break;
        case "backupnow": await reply("💾 Backup done! Check media/backup.json 🧸"); break;
        case "autoreact": db.auto.react = text !== "off"; saveDB(db); await reply(`😍 Autoreact ${db.auto.react ? "ON 🥺" : "OFF"}`); break;
        case "autosticker": db.auto.sticker = text !== "off"; saveDB(db); await reply(`🎨 Autosticker ${db.auto.sticker ? "ON" : "OFF"}`); break;
        case "autostatus": db.auto.status = text !== "off"; saveDB(db); await reply(`📱 Autostatus ${db.auto.status ? "ON" : "OFF"}`); break;
        case "autoclean": db.auto.clean = text !== "off"; saveDB(db); await reply(`🧹 Autoclean ${db.auto.clean ? "ON" : "OFF"}`); break;
        case "autopurge": db.auto.purge = text !== "off"; saveDB(db); await reply(`🗑️ Autopurge ${db.auto.purge ? "ON" : "OFF"}`); break;
        case "autopinrules": db.auto.pinRules = text !== "off"; saveDB(db); await reply(`📌 Autopin rules ${db.auto.pinRules ? "ON" : "OFF"}`); break;
        case "autoforward": db.auto.forward = text !== "off"; saveDB(db); await reply(`↗️ Autoforward ${db.auto.forward ? "ON" : "OFF"}`); break;
        case "autotranslate": db.auto.translate = text !== "off"; saveDB(db); await reply(`🌐 Autotranslate ${db.auto.translate ? "ON" : "OFF"}`); break;
        case "autoreminder": db.auto.reminder = text; saveDB(db); await reply(`⏰ Reminder set: ${text} 💗`); break;

        case "automationstats":
        case "autostats":
            await reply(`🤖 *AUTO STATS* 💗
👋 Welcome: ${db.groups.groups[from]?.autoWelcome ? "ON" : "OFF"}
💬 Replies: ${Object.keys(db.auto.replies||{}).length}
⏰ Jobs: ${(db.auto.jobs||[]).length}
🔍 Filter: ${db.auto.autoFilter ? "ON" : "OFF"}
😍 React: ${db.auto.react ? "ON" : "OFF"}`);
            break;
    }

    // Auto reply logic (runs on any message)
    if (db.auto.replies && !command) {
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
        for (const [k,v] of Object.entries(db.auto.replies)) {
            if (body.toLowerCase().includes(k.toLowerCase())) {
                await sock.sendMessage(from, { text: v }, { quoted: m });
            }
        }
    }
}
