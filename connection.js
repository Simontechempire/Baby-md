// 🎀 BABY BOT - CONNECTION FIXED - NO MORE ZENITH MAIN SOCKET BUG
import makeWASocket, { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_PATH = path.join(__dirname, "auth_sess");
let pairingInProgress = false;

export async function getPairCode(phoneNumber) {
    if(pairingInProgress) throw new Error("Pairing already in progress, wait 1 min");
    pairingInProgress = true;
    try {
        let num = phoneNumber.replace(/[^0-9]/g, "");
        if (num.length < 10) throw new Error("Enter valid number e.g 234...");

        if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
        const { version } = await fetchLatestBaileysVersion();

        // If already registered, don't try to pair
        if (state.creds.registered) {
            console.log("Already registered - return ALREADY");
            pairingInProgress = false;
            return "ALREADY_REGISTERED";
        }

        const sock = makeWASocket({
            version,
            logger: P({ level: "silent" }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Safari"),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
            },
            markOnlineOnConnect: false,
            syncFullHistory: false
        });

        sock.ev.on("creds.update", saveCreds);

        // Wait for connection
        await new Promise((resolve, reject) => {
            let timeout = setTimeout(() => reject(new Error("Socket timeout")), 15000);
            sock.ev.on("connection.update", (u) => {
                if (u.connection === "open") {
                    clearTimeout(timeout);
                    // should not open if not registered, but handle
                }
                // When socket is connecting, we can request code
                if (sock.ws && sock.ws.readyState === 1) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
            setTimeout(() => { clearTimeout(timeout); resolve(); }, 3000);
        });

        console.log(`Requesting code for ${num}`);
        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`💗 Pair Code for ${num}: ${code}`);

        // Close temp socket after 90 sec, let main bot take over
        setTimeout(() => {
            try { sock.ws.close(); } catch {}
            pairingInProgress = false;
            console.log("Temp pairing socket closed - Main bot will auto-connect");
        }, 90000);

        return code;

    } catch (err) {
        pairingInProgress = false;
        console.error("Pair Error:", err.message);
        throw err;
    }
                       }
