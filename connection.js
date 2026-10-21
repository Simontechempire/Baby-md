// 🎀 BABY BOT - ZENITH METHOD FIXED - 100% LINK + REPLY
import makeWASocket, { useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers } from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSION_PATH = path.join(__dirname, "auth_sess");

global.pairingSocket = null;
let busy = false;

export async function getPairCode(phoneNumber) {
    if(busy) throw new Error("Pairing in progress wait 60s");
    busy = true;
    setTimeout(()=> busy=false, 60000);
    
    try {
        let num = phoneNumber.replace(/[^0-9]/g, "");
        if (num.length < 10) throw new Error("Enter valid number e.g 234...");

        // 🎀 ZENITH - Use main socket FIRST (your method)
        if (global.sock && global.sock.requestPairingCode && global.sock.ws?.readyState === 1) {
            console.log(`🎀 ZENITH: Using main socket for ${num}`);
            try {
                let code = await global.sock.requestPairingCode(num);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`💗 BABY BOT Pair Code for ${num}: ${code}`);
                return code; // DON'T close main socket! Fix for reply bug
            } catch (e) {
                console.log("Main socket pairing failed, using temp:", e.message);
            }
        }

        // 🎀 OMEGA FALLBACK - Temp socket (fast version)
        if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

        if (state.creds.registered) {
            console.log("Already registered");
            return "ALREADY_REGISTERED";
        }

        const sock = makeWASocket({
            version: [2,3000,1015901307], // FIXED = 2 sec not 15 sec
            logger: P({ level: "silent" }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Safari"),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
            },
            markOnlineOnConnect: false,
            syncFullHistory: false,
            connectTimeoutMs: 15000
        });

        sock.ev.on("creds.update", saveCreds);
        global.pairingSocket = sock;

        await new Promise(r => setTimeout(r, 2000));

        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`💗 BABY BOT Pair Code for ${num}: ${code} (60 sec)`);

        setTimeout(() => {
            try { 
                if (global.pairingSocket === sock) {
                    sock.ws.close(); 
                    global.pairingSocket = null;
                }
            } catch {}
        }, 60000);

        return code;

    } catch (err) {
        busy = false;
        console.error("Pair Error:", err.message);
        throw err;
    }
}

export function deleteSession() {
    if (fs.existsSync(SESSION_PATH)) {
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
        console.log("Session deleted!");
        return true;
    }
    return false;
            }
