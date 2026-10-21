// 🎀 BABY BOT - CONNECTION | OMEGA ZENITH METHOD | 100% LINK FIX 💗
import makeWASocket, { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎀 SAME PATH AS INDEX.JS - THIS WAS YOUR BUG!
const SESSION_PATH = path.join(__dirname, "auth_sess");

global.pairingSocket = null;

export async function getPairCode(phoneNumber) {
    try {
        let num = phoneNumber.replace(/[^0-9]/g, "");
        if (num.length < 10) throw new Error("Enter valid number with country code, e.g 234...");

        // 🎀 ZENITH METHOD - If bot main socket exists, use it (most stable)
        if (global.sock && global.sock.requestPairingCode) {
            console.log(`🎀 ZENITH: Using main socket for ${num}`);
            try {
                let code = await global.sock.requestPairingCode(num);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`💗 BABY BOT Pair Code for ${num}: ${code}`);
                return code;
            } catch (e) {
                console.log("Main socket pairing failed, trying temp socket:", e.message);
                // fall through to temp socket
            }
        }

        // 🎀 OMEGA METHOD - Temp socket with 60 sec keep alive
        if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            logger: P({ level: "silent" }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Safari"), // 🎀 ZENITH FIX - Ubuntu = FAIL, Safari = SUCCESS
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
            },
            markOnlineOnConnect: false,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
            syncFullHistory: false,
            retryRequestDelayMs: 2000
        });

        sock.ev.on("creds.update", saveCreds);
        global.pairingSocket = sock;

        // Wait 3 sec for socket to be ready
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if already registered
        if (sock.authState.creds.registered) {
            console.log("Already registered, need logout");
            try { sock.ws.close(); } catch {}
            global.pairingSocket = null;
            return "ALREADY_REGISTERED";
        }

        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`💗 BABY BOT Pair Code for ${num}: ${code} (60 sec valid)`);

        // 🎀 FIX: Keep alive 60 sec NOT 5 sec - This fixes "does not link"
        setTimeout(() => {
            try { 
                if (global.pairingSocket === sock) {
                    console.log("Closing pairing socket after 60 sec");
                    sock.ws.close(); 
                    global.pairingSocket = null;
                }
            } catch {}
        }, 60000);

        return code;

    } catch (err) {
        console.error("🎀 Pair Code Error:", err.message);
        throw err;
    }
}

export function deleteSession() {
    if (fs.existsSync(SESSION_PATH)) {
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
        console.log("🧸 Session deleted! You can pair again");
        return true;
    }
    return false;
}
