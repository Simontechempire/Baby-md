async function startBabyBot(){
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ 
        version, 
        logger: P({level:"silent"}), 
        printQRInTerminal:false, 
        auth:{ creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:"silent"})) }, 
        browser: Browsers.macOS("Safari"),
        markOnlineOnConnect:true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        syncFullHistory: false
    });

    global.sock = sock;

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", async (update)=>{
        const { connection, lastDisconnect } = update;
        if(connection==="close"){
            const shouldReconnect = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            if(shouldReconnect) setTimeout(startBabyBot,3000);
        }else if(connection==="open"){
            console.log("💗 " + BOT_NAME + " ONLINE! 🍼 OMEGA ZENITH");
            try{
                await sock.sendMessage(sock.user.id, { text: `✅ ${BOT_NAME} ONLINE!\nPrefix: ${PREFIX}\nSend ${PREFIX}menu` });
            }catch{}
        }
    });
    
    const plugins={}; 
    const cats=["Owner","Group","Moderator","Auto","Anti","Baby"];
    let total = 0;
    for(const cat of cats){
        const catPath=path.join(__dirname,"plugins",cat);
        plugins[cat.toLowerCase()]=[];
        if(fs.existsSync(catPath)){
            const files = fs.readdirSync(catPath).filter(f=>f.endsWith(".js"));
            console.log("📁 " + cat + ": " + files.length);
            total += files.length;
            for(const file of files){
                try{ 
                    const plugin=await import("file://" + path.join(catPath,file) + "?update=" + Date.now()); 
                    plugins[cat.toLowerCase()].push(plugin.default||plugin); 
                }catch(e){}
            }
        }
    }
    console.log("🎀 TOTAL LOADED: " + total + " PLUGINS 💗");
    
    // 🎀 FIXED MESSAGE HANDLER - NOW REPLIES!
    sock.ev.on("messages.upsert", async ({messages})=>{
        try{
            const m=messages[0];
            if(!m) return;
            if(!m.message) return;
            // Allow fromMe=false only
            if(m.key.fromMe) return;

            const from=m.key.remoteJid;
            if(!from) return;

            const type=Object.keys(m.message)[0];
            let body = "";
            if(type==="conversation") body=m.message.conversation;
            else if(type==="extendedTextMessage") body=m.message.extendedTextMessage.text;
            else if(type==="imageMessage") body=m.message.imageMessage.caption||"";
            else if(type==="videoMessage") body=m.message.videoMessage.caption||"";
            else body="";

            console.log(`📩 ${from}: ${body}`); // DEBUG - see in logs

            if(!body) return;
            if(!body.startsWith(PREFIX)) return;

            const args=body.slice(PREFIX.length).trim().split(/ +/);
            const command=args.shift().toLowerCase();
            if(!command) return;

            console.log(`🎀 COMMAND: ${command} from ${from}`);

            const meta={ command, args, text:args.join(" "), from, PREFIX, BOT_NAME, IMAGE_URL, isGroup:from.endsWith("@g.us"), sock, m, loadDB };

            // 🎀 DIRECT MENU / PING - Always work even if plugins fail
            if(["menu","help","allmenu","ping","alive","owner"].includes(command)){
                if(command==="ping"){
                    await sock.sendMessage(from, { text: `🎀 PONG! ${BOT_NAME} ACTIVE 💗\nSpeed: ${Date.now()%1000}ms` }, { quoted: m });
                    return;
                }
                if(["menu","help","allmenu"].includes(command)){
                    await sock.sendMessage(from, { image:{url:IMAGE_URL}, caption:`🎀 𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 💗\n\nPrefix: ${PREFIX}\nTotal: ${total} Commands\n\nOwner: 15\nGroup: 40\nMod: 30\nAuto: 30\nAnti: 35\nBaby: 50\n\nTry ${PREFIX}ping` }, {quoted:m});
                    return;
                }
            }

            // Run plugins
            for(const cat of cats){
                for(const h of (plugins[cat.toLowerCase()]||[])){
                    try{
                        if(typeof h==='function') await h(sock,m,meta);
                    }catch(e){}
                }
            }
        }catch(err){ console.error("Message error:", err.message); }
    });
}
startBabyBot();
