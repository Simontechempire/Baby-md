// 🎀 BABY BOT - CONNECTION | Pair Code System | Baby Method 💗
import makeWASocket, { useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import P from "pino";
import fs from "fs";

const SESSION_PATH = "./session";

// 🎀 Generate Pair Code
export async function getPairCode(phoneNumber) {
    try {
        if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });
        
        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
        
        const sock = makeWASocket({
            logger: P({ level: "silent" }),
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
            },
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            markOnlineOnConnect: false
        });

        sock.ev.on("creds.update", saveCreds);

        // 🎀 Request Pairing Code if not registered
        if (!sock.authState.creds.registered) {
            // Clean number: only digits
            let num = phoneNumber.replace(/[^0-9]/g, "");
            
            // Small delay to ensure socket ready
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const code = await sock.requestPairingCode(num);
            console.log(`💗 BABY BOT Pair Code for ${num}: ${code}`);
            return code;
        } else {
            return "ALREADY_REGISTERED";
        }

    } catch (err) {
        console.error("🎀 Pair Code Error:", err);
        throw err;
    }
}

// 🎀 Delete Session (for re-pair)
export function deleteSession() {
    if (fs.existsSync(SESSION_PATH)) {
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
        console.log("🧸 Session deleted!");
        return true;
    }
    return false;
}
