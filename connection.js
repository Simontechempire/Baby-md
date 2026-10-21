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
    if(busy) throw new Error("Wait 60 sec");
    busy = true;
    setTimeout(()=> busy=false, 60000);
    try {
        let num = phoneNumber.replace(/[^0-9]/g, "");
        if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });

        if (global.sock && global.sock.requestPairingCode && global.sock.ws?.readyState === 1) {
            try {
                let code = await global.sock.requestPairingCode(num);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`💗 Pair Code: ${code}`);
                return code;
            } catch (e) { console.log("Main fail, temp:", e.message); }
        }

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
        if (state.creds.registered) return "ALREADY_REGISTERED";

        const sock = makeWASocket({
            version: [2,3000,1015901307],
            logger: P({ level: "silent" }),
            browser: Browsers.macOS("Safari"),
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })) },
            markOnlineOnConnect: false,
            syncFullHistory: false
        });

        sock.ev.on("creds.update", saveCreds);
        global.pairingSocket = sock;
        await new Promise(r => setTimeout(r, 2000));
        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(`💗 Pair Code: ${code}`);
        setTimeout(()=>{ try{ sock.ws.close(); }catch{} }, 70000);
        return code;
    } catch (err) {
        busy = false;
        throw err;
    }
}

export function deleteSession() {
    if (fs.existsSync(SESSION_PATH)) {
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
        return true;
    }
    return false;
}
