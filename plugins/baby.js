// 👶 BABY - 50 COMMANDS FULLY CODED | Baby Method 💗🧸
import { loadDB, saveDB } from "../../database.js";

export default async function(sock, m, { command, args, text, from }) {
    const db = loadDB();
    const reply = async (t) => await sock.sendMessage(from, { text: t }, { quoted: m });
    const sender = m.key.participant || from;
    const getMentioned = () => m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    const cuteReacts = ["🥺","💗","🧸","😍","🥰","😘","🤗","😚","💋","😻"];
    const randomReact = () => cuteReacts[Math.floor(Math.random()*cuteReacts.length)];

    switch(command) {
        case "baby": await reply(`Hii baby! ${randomReact()} I'm Baby Bot 💗🧸 How are you today? 🥺`); break;
        case "babyhelp": await reply(`👶 Use .babymenu for 50 baby commands 💗`); break;
        case "babystart": db.baby.active[from] = true; saveDB(db); await reply("👶 Baby mode ON! I'm awake! 🧸💗"); break;
        case "babyoff": db.baby.active[from] = false; saveDB(db); await reply("💤 Baby mode OFF... night 🥺"); break;
        case "babystats": await reply(`👶 *BABY STATS*\n💗 Active: ${db.baby.active[from] ? "Yes 🧸" : "No 💤"}\n😍 Cuddles: ${db.baby.cuddles || 0}\n💋 Kisses: ${db.baby.kisses || 0}`); break;

        case "cuddle":
            const cuddleUser = getMentioned()[0];
            await sock.sendMessage(from, { text: `🤗 @${sender.split("@")[0]} cuddled @${cuddleUser ? cuddleUser.split("@")[0] : "you"} so tight! 🧸💗 So warm! 🥺`, mentions: cuddleUser ? [sender, cuddleUser] : [sender] }, { quoted: m });
            db.baby.cuddles = (db.baby.cuddles||0)+1; saveDB(db);
            break;

        case "hug": await sock.sendMessage(from, { text: `🫂 Big hug for @${(getMentioned()[0]||sender).split("@")[0]}! 🤗💗 You are loved! 🥺`, mentions: [getMentioned()[0]||sender] }, { quoted: m }); break;
        case "kiss": 
            db.baby.kisses = (db.baby.kisses||0)+1; saveDB(db);
            await sock.sendMessage(from, { text: `😘 @${sender.split("@")[0]} kissed @${(getMentioned()[0]||sender).split("@")[0]}! 💋💗 Mwah!`, mentions: [sender, getMentioned()[0]||sender] }, { quoted: m }); break;
        case "pat": await reply(`🤲 Pat pat @${(getMentioned()[0]||sender).split("@")[0]}! Good baby! 🧸💗`, { mentions: [getMentioned()[0]||sender] }); break;
        case "boop": await reply(`👉 Boop! @${(getMentioned()[0]||sender).split("@")[0]} nose booped! 🥺👶💗`); break;
        case "poke": await reply(`👉 Poked @${(getMentioned()[0]||sender).split("@")[0]}! Hehe! 😜💗`); break;
        case "tickle": await reply(`🤭 Tickle tickle @${(getMentioned()[0]||sender).split("@")[0]}! Hahaha! 😂💗`); break;
        case "love": await sock.sendMessage(from, { text: `💗 @${sender.split("@")[0]} loves you so much @${(getMentioned()[0]||sender).split("@")[0]}! 🥺💋 You are my everything! 🧸`, mentions: [sender, getMentioned()[0]||sender] }, { quoted: m }); break;

        case "ship":
            const users = getMentioned();
            const percent = Math.floor(Math.random()*101);
            await reply(`💘 *SHIP* 💗\n@${(users[0]||sender).split("@")[0]} + @${(users[1]||sender).split("@")[0]} = ${percent}% ${percent>80?"Perfect couple! 💍💗":percent>50?"Cute! 🧸":"Hmm maybe not 🥺"}`, { mentions: users.length?users:[sender] });
            break;

        case "crush": await reply(`😳 Your crush is @${(getMentioned()[0]||sender).split("@")[0]}! Secret! 🤫💗`); break;
        case "marry": await sock.sendMessage(from, { text: `💍 @${sender.split("@")[0]} proposed to @${(getMentioned()[0]||sender).split("@")[0]}! Say yes! 🥺💗💒`, mentions: [sender, getMentioned()[0]||sender] }, { quoted: m }); break;
        case "divorce": await reply(`💔 Oh no! Divorced! 🥺 It's okay baby...`); break;
        case "couple": await reply(`💑 Cute couple: @${sender.split("@")[0]} & @${(getMentioned()[0]||sender).split("@")[0]} 💗🧸`, { mentions: [sender, getMentioned()[0]||sender] }); break;
        case "cute": await reply(`🥺 You are sooo cute! @${(getMentioned()[0]||sender).split("@")[0]}! Like a baby! 👶💗`); break;

        // MEDIA
        case "babyquote": {
            const quotes = ["You are my sunshine baby! 💗", "Every moment with you is magical 🧸", "You make my heart go doki doki 🥺💗", "Stay cute baby! 😍"];
            await reply(`💗 *BABY QUOTE*: ${quotes[Math.floor(Math.random()*quotes.length)]}`);
            break;
        }
        case "babymeme": await reply("😂 Baby meme: *When she says 'I'm fine' but she's actually a baby needing cuddles* 🧸💗"); break;
        case "babystickers": await reply("🎨 Send .sticker with image to make baby stickers! 🧸"); break;
        case "babyemoji": await reply(`😍 Baby emojis: 🥺💗🧸😘🤗😚💋👶🍼🎀`); break;
        case "babypic": await sock.sendMessage(from, { image: { url: "https://files.catbox.moe/yvgx71.jpg" }, caption: "👶 Your baby pic! So cute! 💗🧸" }, { quoted: m }); break;
        case "babyvoice": await reply("🎤 Baby voice: *sends cute voice* UwU hii baby! 💗 (voice feature soon)"); break;
        case "babydance": await reply("💃 Baby dancing: (っ◔◡◔)っ 💗🧸 *dances*"); break;
        case "babysing": await reply("🎤 Baby singing: Twinkle twinkle little baby~ you are my star~ 💗🎶"); break;
        case "babylaugh": await reply("😂 Hahahaha! Baby laugh! Hehehe! 🧸💗"); break;
        case "babycry": await reply("😭 Waaah! Baby crying! Hug me! 🥺💗 *cries*"); break;
        case "babysleep": await reply("😴 Baby sleepy... Good night... Zzz... 💤💗🧸"); break;
        case "babywake": await reply("☀️ Baby awake! Good morning! 🧸💗 *stretches*"); break;
        case "babygoodnight": await reply("🌙 Good night baby! Dream of me! 😴💗🧸 Sweet dreams!"); break;
        case "babygoodmorning": await reply("☀️ Good morning my baby! Have a cute day! 💗🧸🌸"); break;
        case "babybirthday": await reply(`🎂 Happy birthday @${(getMentioned()[0]||sender).split("@")[0]}! 🎉💗 Many more cute years! 🧸🎀`, { mentions: [getMentioned()[0]||sender] }); break;
        case "babycompliment": {
            const comps = ["You are the cutest baby ever! 🥺💗", "Your smile makes my day! 😍🧸", "You are perfect like a doll! 👶💋"];
            await reply(comps[Math.floor(Math.random()*comps.length)]);
            break;
        }

        // GAMES
        case "babyroast": await reply(`😜 Roast: You are so cute I can't even roast you! 🧸💗 That's the roast!`); break;
        case "babytruth": await reply(`😳 Truth: Who is your crush baby? Tell me! 🤫💗`); break;
        case "babydare": await reply(`😈 Dare: Send "I love Baby Bot 💗" to your crush! 🧸`); break;
        case "babyriddle": await reply(`🧩 Riddle: What gets cuter every day? Answer: You baby! 💗🧸`); break;
        case "babyquiz": await reply(`🧠 Quiz: What does baby like most? A) Cuddles B) Kisses C) You 💗 Answer: C!`); break;
        case "babygame": await reply(`🎮 Baby game: Type .babydice or .babyrps to play! 🧸💗`); break;
        case "babydice": await reply(`🎲 Dice: ${Math.floor(Math.random()*6)+1}! ${randomReact()}`); break;
        case "babyrps":
            const choices = ["rock","paper","scissors"];
            const botChoice = choices[Math.floor(Math.random()*3)];
            const userChoice = text.toLowerCase() || "rock";
            await reply(`✂️ You: ${userChoice} | Baby: ${botChoice} | ${userChoice===botChoice?"Draw! 🥺":"I win! 😜💗"}`);
            break;
        case "babycoin": await reply(`🪙 Coin: ${Math.random()>0.5?"Heads! 👶":"Tails! 💗"}`); break;
        case "babyfortune": {
            const fortunes = ["You will get many cuddles today! 🤗💗", "A cute surprise coming! 🧸🎁", "You are loved more than you know! 🥺💋"];
            await reply(`🔮 Fortune: ${fortunes[Math.floor(Math.random()*fortunes.length)]}`);
            break;
        }
        case "babyhoroscope": await reply(`♈ Horoscope: Today is your cute day! Love is in air! 💗🧸✨`); break;
        case "babyweather": await reply(`☁️ Baby weather: It's sunny with 100% chance of cuteness! 💗🧸☀️`); break;
        case "babyai":
            if (!text) return reply("👶 Ask me anything baby! Use .babyai how are you?");
            await reply(`👶 Baby AI: ${text}?\nAnswer: That's so cute baby! I love you! 💗🧸 But I'm just a baby bot, ask me cute things! 🥺`);
            break;
        case "babysettings": await reply(`⚙️ Baby settings:\n.babystart - Start baby mode\n.babyoff - Stop\n.babystats - Stats 💗`); break;

        // Specials from settings
        case "vv":
        case "viewonce":
            if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2) {
                const q = m.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message;
                await sock.sendMessage(from, { forward: q }, { quoted: m });
                await reply("👀 View once revealed baby! 🧸💗");
            } else await reply("Reply to a view once with .vv");
            break;

        case "togcstatus":
        case "togc":
            if (!text && !m.message.imageMessage) return reply("Use: .togcstatus text or with image");
            if (m.message.imageMessage) {
                const buf = await sock.downloadMediaMessage(m);
                await sock.sendMessage(from, { image: buf, caption: text }, { status: true });
            } else {
                await sock.sendMessage(from, { text }, { status: true });
            }
            await reply("✅ Posted to group status? Use WhatsApp status post via .autostatus 💗");
            break;
    }
                        }
