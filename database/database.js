// 🎀 BABY BOT DATABASE - FINAL FIX 💗🧸
// Works with database/database.json | 200 Commands

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎀 FIXED PATH - works on Render
const DB_PATH = path.join(__dirname, "database", "database.json");

const DEFAULT_DB = {
  antilink: {},
  antibadword: {},
  antidelete: {},
  warnings: { groups: {} },
  users: {
    users: {},
    banned: [],
    premium: ["2349166265317"],
    afk: {}
  },
  groups: {
    groups: {},
    anti: {},
    badwords: {},
    welcome: {},
    goodbye: {},
    rules: {},
    settings: {
      antilink: false,
      antibadword: false,
      antidelete: false,
      welcome: true,
      goodbye: true,
      autobio: false,
      antibot: false,
      antiforeign: false
    }
  },
  baby: {
    simi: false,
    autolike: true,
    autoread: true,
    autoview: true,
    autotyping: false,
    autorecording: false,
    active: {},
    antilink: {},
    warnings: {},
    chats: {},
    couple: {},
    ship: {},
    levels: {},
    afk: {},
    baby_users: {},
    cuddles: 0,
    kisses: 0,
    settings: {
      prefix: ".",
      botName: "BABY BOT 🎀",
      owner: "2349166265317",
      ownerName: "Simon tech",
      image: "https://files.catbox.moe/yvgx71.jpg",
      mode: "public",
      version: "1.0.0"
    }
  },
  session: {},
  media: {},
  owners: ["2349166265317"],
  bot: {
    name: "BABY BOT",
    prefix: ".",
    mode: "public",
    started: "2026-10-20"
  }
};

export function loadDB() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      console.log("🧸 database/database.json created! 💗");
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    return {
      ...DEFAULT_DB,
      ...data,
      groups: { ...DEFAULT_DB.groups, ...data.groups },
      baby: { ...DEFAULT_DB.baby, ...data.baby },
      users: { ...DEFAULT_DB.users, ...data.users }
    };
  } catch (e) {
    console.error("❌ DB Load Error:", e.message);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

export function saveDB(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error("❌ DB Save Error:", e.message);
    return false;
  }
}

export function getDB() {
  return loadDB();
}

export default { loadDB, saveDB, getDB, DEFAULT_DB };

// Auto init
loadDB();
