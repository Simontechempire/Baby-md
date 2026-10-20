// 👑 OWNER - 15 COMMANDS FULLY CODED | Baby Method 💗
import fs from "fs";
import os from "os";
import { loadDB, saveDB } from "../../database.js";

export default async function(sock, m, { command, args, text, from, PREFIX }) {
    const db = loadDB();
    const ownerNumbers = [db.baby.settings.owner, "2349166265317"];
    const sender = m.key.participant || from;
    const isOwner = ownerNumbers.some(n => sender.includes(n));
    if (!isOwner) return;

    const reply = async (t) => await sock.sendMessage(from, { text: t }, { quoted: m });
    const q = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    switch(command) {
        case "owner":
            await sock.sendMessage(from, { contacts: { displayName: "BABY BOT Owner", contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Simon Tech 👑\nTEL;type=CELL;type=VOICE;waid=${ownerNumbers[0]}:+${ownerNumbers[0]}\nEND:VCARD` }] } }, { quoted: m });
            break;

        case "addowner":
            if (!text) return reply(`👑 Use: ${PREFIX}addowner 234...`);
            db.users.premium.push(text.replace(/[^0-9]/g,""));
            saveDB(db);
            await reply(`✅ Added owner: ${text} 💗`);
            break;

        case "delowner":
            if (!text) return reply(`👑 Use: ${PREFIX}delowner 234...`);
            db.users.premium = db.users.premium.filter(x => x !== text.replace(/[^0-9]/g,""));
            saveDB(db);
            await reply(`🗑️ Removed owner: ${text}`);
            break;

        case "botstats":
            const uptime = process.uptime();
            const mem = process.memoryUsage();
            await reply(`🤖 *BOT STATS* 💗
╭━━━〔 👑 STATS 〕━━━╮
┃ ⏱️ Uptime: ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m
┃ 💾 RAM: ${(mem.heapUsed/1024/1024).toFixed(2)} MB
┃ 💻 Platform: ${os.platform()}
┃ 📚 Commands: 200
┃ 👑 Owner: ${ownerNumbers[0]}
┃ 🔋 CPU: ${os.cpus()[0].model}
╰━━━━━━━━━━━━━━━━━━━━╯`);
            break;

        case "broadcast":
        case "bc":
            if (!text) return reply(`📢 Use: ${PREFIX}broadcast your message`);
            const chats = Object.keys(await sock.groupFetchAllParticipating());
            for (const id of chats) {
                await sock.sendMessage(id, { text: `📢 *BROADCAST* 💗\n\n${text}` });
            }
            await reply(`✅ Broadcast sent to ${chats.length} groups 🧸`);
            break;

        case "restart":
            await reply("🧸 Restarting Baby Bot... 💗");
            setTimeout(() => process.exit(0), 1000);
            break;

        case "shutdown":
            await reply("💤 Shutting down... Bye baby! 🥺");
            setTimeout(() => process.exit(0), 1000);
            break;

        case "maintenance":
            db.baby.settings.mode = text === "on" ? "maintenance" : "public";
            saveDB(db);
            await reply(`🔧 Maintenance: ${db.baby.settings.mode} 💗`);
            break;

        case "setprefix":
            if (!text) return reply(`⚙️ Use: ${PREFIX}setprefix newprefix`);
            db.baby.settings.prefix = text[0];
            saveDB(db);
            await reply(`✅ Prefix changed to: ${text[0]} 🎀`);
            break;

        case "setname":
            if (!text) return reply(`Use: ${PREFIX}setname New Name`);
            await sock.updateProfileName(text);
            await reply(`✅ Bot name set to: ${text} 💗`);
            break;

        case "setbio":
            if (!text) return reply(`Use: ${PREFIX}setbio New bio`);
            await sock.updateProfileStatus(text);
            await reply(`✅ Bio updated: ${text} 🧸`);
            break;

        case "setphoto":
            if (!m.message.imageMessage) return reply("🖼️ Send image with caption .setphoto");
            const buffer = await sock.downloadMediaMessage(m);
            await sock.updateProfilePicture(sock.user.id, buffer);
            await reply("✅ Profile photo updated! 💗");
            break;

        case "logs":
            const log = fs.existsSync("./logs.txt") ? fs.readFileSync("./logs.txt","utf8").slice(-1000) : "No logs yet";
            await reply(`📄 *LOGS*:\n${log}`);
            break;

        case "backup":
            const backupData = JSON.stringify(db, null, 2);
            fs.writeFileSync("./media/backup.json", backupData);
            await sock.sendMessage(from, { document: fs.readFileSync("./media/backup.json"), mimetype: "application/json", fileName: "baby-backup.json" }, { quoted: m });
            break;

        case "ownerhelp":
        case "ownermenu":
            await reply(`👑 *OWNER MENU - 15* 💗
01. .owner - Owner contact
02. .addowner 234... - Add owner
03. .delowner 234... - Remove owner
04. .botstats - Bot stats
05. .broadcast text - Broadcast to groups
06. .restart - Restart bot
07. .shutdown - Shutdown bot
08. .maintenance on/off - Maintenance mode
09. .setprefix . - Change prefix
10. .setname - Change bot name
11. .setbio - Change bio
12. .setphoto (with image) - Change photo
13. .logs - Show logs
14. .backup - Backup database
15. .ownerhelp - This menu`);
            break;
    }
                          }
