import makeWASocket, { useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers } from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSION_PATH = path.join(__dirname, "auth_sess");
let busy = false;

export async function getPairCode(phoneNumber) {
    if(busy) throw new Error("Wait 60 sec before new code");
    busy = true;
    setTimeout(()=> busy=false, 60000);
    let num = phoneNumber.replace(/[^0-9]/g, "");
    if(!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    if(state.creds.registered){ busy=false; return "ALREADY_REGISTERED"; }
    const sock = makeWASocket({
        version: [2,3000,1015901307],
        logger: P({ level: "silent" }),
        browser: Browsers.macOS("Safari"),
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })) },
        markOnlineOnConnect: false,
        syncFullHistory: false,
        connectTimeoutMs: 10000
    });
    sock.ev.on("creds.update", saveCreds);
    await new Promise(r=>setTimeout(r, 1500));
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`💗 FAST CODE ${num}: ${code}`);
    setTimeout(()=>{ try{ sock.ws.close(); }catch{} }, 45000);
    return code;
        }
