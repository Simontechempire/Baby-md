// 🎀 BABY BOT - FULL CMD MENU EXACT DESIGN 💗🧸

export default async function(sock, m, { command, from, PREFIX, IMAGE_URL }) {
    if (!["menu","help","allmenu","babymenu","ownermenu","groupmenu","modmenu","automenu","antimenu","settings","botmenu"].includes(command)) return;

    const fullMenu = `🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 — 𝐅𝐔𝐋𝐋 𝐂𝐌𝐃 𝐌𝐄𝐍𝐔 💗🧸
WhatsApp Bot | Baby Method | 200 Commands
╭━━━〔 🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 🎀 〕━━━╮
┃
┃ 🧸 Hᴇʟʟᴏ, Bᴀʙʏ! 💗
┃ ✨ Welcome to Baby Bot!
┃
┃ 👑 Owner      │ 15 Commands
┃ 👥 Group      │ 40 Commands
┃ 🛡️ Moderator  │ 30 Commands
┃ 🤖 Auto       │ 30 Commands
┃ 🚫 Anti       │ 35 Commands
┃ 👶 Baby       │ 50 Commands
┃
┃ 📚 Total: 200 Commands
┃ 💗 Prefix: ${PREFIX}
┃
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
👑 1. OWNER COMMANDS — 15
╭━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 01. .owner
┃ 02. .addowner
┃ 03. .delowner
┃ 04. .botstats
┃ 05. .broadcast
┃ 06. .restart
┃ 07. .shutdown
┃ 08. .maintenance
┃ 09. .setprefix
┃ 10. .setname
┃ 11. .setbio
┃ 12. .setphoto
┃ 13. .logs
┃ 14. .backup
┃ 15. .ownerhelp
┃
╰━━━━━━━━━━━━━━━━━━━━╯
👥 2. GROUP COMMANDS — 40
╭━━━〔 👥 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 01. .group
┃ 02. .ginfo
┃ 03. .admins
┃ 04. .members
┃ 05. .rules
┃ 06. .setrules
┃ 07. .welcome
┃ 08. .goodbye
┃ 09. .setwelcome
┃ 10. .setgoodbye
┃ 11. .pin
┃ 12. .unpin
┃ 13. .purge
┃ 14. .del
┃ 15. .kick
┃ 16. .ban
┃ 17. .unban
┃ 18. .mute
┃ 19. .unmute
┃ 20. .warn
┃ 21. .unwarn
┃ 22. .warnings
┃ 23. .promote
┃ 24. .demote
┃ 25. .lock
┃ 26. .unlock
┃ 27. .slowmode
┃ 28. .settitle
┃ 29. .setdescription
┃ 30. .setphoto
┃ 31. .invitelink
┃ 32. .setflood
┃ 33. .report
┃ 34. .staff
┃ 35. .tagall
┃ 36. .afk
┃ 37. .back
┃ 38. .id
┃ 39. .adminshelp
┃ 40. .groupstats
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🛡️ 3. MODERATOR COMMANDS — 30
╭━━━〔 🛡️ 𝐌𝐎𝐃 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 01. .mod
┃ 02. .modhelp
┃ 03. .check
┃ 04. .history
┃ 05. .modlogs
┃ 06. .warnlist
┃ 07. .clearwarns
┃ 08. .tempban
┃ 09. .tempmute
┃ 10. .unrestrict
┃ 11. .slowchat
┃ 12. .unslowchat
┃ 13. .freeze
┃ 14. .unfreeze
┃ 15. .approve
┃ 16. .unapprove
┃ 17. .approved
┃ 18. .blacklist
┃ 19. .unblacklist
┃ 20. .blacklistlist
┃ 21. .filter
┃ 22. .stopfilter
┃ 23. .filters
┃ 24. .setwarnlimit
┃ 25. .setwarnmode
┃ 26. .cleanservice
┃ 27. .cleancommands
┃ 28. .reportlist
┃ 29. .resolve
┃ 30. .modstats
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🤖 4. AUTOMATION COMMANDS — 30
╭━━━〔 🤖 𝐀𝐔𝐓𝐎 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 01. .auto
┃ 02. .autowelcome
┃ 03. .autogoodbye
┃ 04. .autoreply
┃ 05. .autodel
┃ 06. .autopin
┃ 07. .autofilter
┃ 08. .autoban
┃ 09. .automute
┃ 10. .autowarn
┃ 11. .antiflood
┃ 12. .antiraid
┃ 13. .autolock
┃ 14. .autounlock
┃ 15. .schedule
┃ 16. .canceljob
┃ 17. .jobs
┃ 18. .settimezone
┃ 19. .autobackup
┃ 20. .backupnow
┃ 21. .autoreact
┃ 22. .autosticker
┃ 23. .autostatus
┃ 24. .autoclean
┃ 25. .autopurge
┃ 26. .autopinrules
┃ 27. .autoforward
┃ 28. .autotranslate
┃ 29. .autoreminder
┃ 30. .automationstats
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🚫 5. ANTI COMMANDS — 35
╭━━━〔 🚫 𝐀𝐍𝐓𝐈 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 01. .anti
┃ 02. .antilink
┃ 03. .antilinkmode
┃ 04. .antispam
┃ 05. .antiforward
┃ 06. .antibot
┃ 07. .antiraid
┃ 08. .antiflood
┃ 09. .antitag
┃ 10. .antichannel
┃ 11. .antisticker
┃ 12. .antigif
┃ 13. .antimedia
┃ 14. .antiphoto
┃ 15. .antivideo
┃ 16. .antiaudio
┃ 17. .antidoc
┃ 18. .antiemoji
┃ 19. .antibadword
┃ 20. .badwordadd
┃ 21. .badworddel
┃ 22. .badwordlist
┃ 23. .antiscam
┃ 24. .antiphishing
┃ 25. .antirepeat
┃ 26. .antiduplicate
┃ 27. .antijoin
┃ 28. .antileave
┃ 29. .antiporn
┃ 30. .antinsfw
┃ 31. .antimention
┃ 32. .antiedit
┃ 33. .antidelete
┃ 34. .antivirus
┃ 35. .antistats
┃
╰━━━━━━━━━━━━━━━━━━━━╯
👶 6. BABY COMMANDS — 50
╭━━━〔 👶 𝐁𝐀𝐁𝐘 𝐌𝐄𝐍𝐔 〕━━━╮
┃
┃ 🎀 FUN & CUTE COMMANDS 🎀
┃
┃ 01. .baby
┃ 02. .babyhelp
┃ 03. .babymenu
┃ 04. .babystart
┃ 05. .babyoff
┃ 06. .babystats
┃ 07. .cuddle
┃ 08. .hug
┃ 09. .kiss
┃ 10. .pat
┃ 11. .boop
┃ 12. .poke
┃ 13. .tickle
┃ 14. .love
┃ 15. .ship
┃ 16. .crush
┃ 17. .marry
┃ 18. .divorce
┃ 19. .couple
┃ 20. .cute
┃
┃ 🧸 MEDIA & ENTERTAINMENT 🧸
┃
┃ 21. .babyquote
┃ 22. .babymeme
┃ 23. .babystickers
┃ 24. .babyemoji
┃ 25. .babypic
┃ 26. .babyvoice
┃ 27. .babydance
┃ 28. .babysing
┃ 29. .babylaugh
┃ 30. .babycry
┃ 31. .babysleep
┃ 32. .babywake
┃ 33. .babygoodnight
┃ 34. .babygoodmorning
┃ 35. .babybirthday
┃ 36. .babycompliment
┃
┃ 💗 GAMES & AI BABY 💗
┃
┃ 37. .babyroast
┃ 38. .babytruth
┃ 39. .babydare
┃ 40. .babyriddle
┃ 41. .babyquiz
┃ 42. .babygame
┃ 43. .babydice
┃ 44. .babyrps
┃ 45. .babycoin
┃ 46. .babyfortune
┃ 47. .babyhoroscope
┃ 48. .babyweather
┃ 49. .babyai
┃ 50. .babysettings
┃
╰━━━━━━━━━━━━━━━━━━━━╯
💗 7. SETTINGS MENU
╭━━━〔 ⚙️ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 〕━━━╮
┃
┃ .settings
┃ .setprefix
┃ .setname
┃ .setbio
┃ .setphoto
┃ .settimezone
┃ .maintenance
┃ .autobackup
┃ .backupnow
┃ .botstats
┃ .vv review view once
┃ .togcstatus Post to group status
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🎀 8. ALL COMMANDS SUMMARY
╭━━━〔 🎀 BABY BOT SUMMARY 🎀 〕━━━╮
┃
┃ 👑 Owner       = 15
┃ 👥 Group       = 40
┃ 🛡️ Moderator   = 30
┃ 🤖 Auto        = 30
┃ 🚫 Anti        = 35
┃ 👶 Baby        = 50
┃
┃ 📚 TOTAL       = 200 COMMANDS
┃
┃ 💗 Prefix: .
┃ 🧸 Style: Baby Method
┃ ✨ Platform: WhatsApp
┃
╰━━━━━━━━━━━━━━━━━━━━╯

       🎀 𝐌𝐀𝐃𝐄 𝐖𝐈𝐓𝐇 💗 🎀`;

    // Individual Menus
    if (command === "ownermenu") {
        return await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: fullMenu.split("👥 2.")[0] }, { quoted: m });
    }
    if (command === "groupmenu") {
        const g = fullMenu.split("👥 2. GROUP")[1].split("🛡️ 3.")[0];
        return await sock.sendMessage(from, { text: "👥 2. GROUP COMMANDS — 40\n╭━━━〔 👥 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 〕━━━╮\n" + g }, { quoted: m });
    }
    if (command === "babymenu") {
        const b = fullMenu.split("🍏 6. BABY")[1].split("💗 7.")[0];
        return await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: "👶 6. BABY COMMANDS — 50" + b }, { quoted: m });
    }

    // All Menu = Full
    await sock.sendMessage(from, { image: { url: IMAGE_URL }, caption: fullMenu }, { quoted: m });
          }
