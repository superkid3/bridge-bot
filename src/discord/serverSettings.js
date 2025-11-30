const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve("data");
const FILE_PATH = path.join(DATA_DIR, "serverSettings.json");

let cache = {};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify({}, null, 2));
  }
}

function load() {
  ensureFile();
  try {
    cache = JSON.parse(fs.readFileSync(FILE_PATH));
  } catch (e) {
    cache = {};
  }
}

function save() {
  ensureFile();
  fs.writeFileSync(FILE_PATH, JSON.stringify(cache, null, 2));
}

function getSettings(guildId) {
  if (!cache[guildId]) cache[guildId] = {};
  return cache[guildId];
}

function setAdminRole(guildId, roleId) {
  if (!cache[guildId]) cache[guildId] = {};
  cache[guildId].adminRole = roleId;
  save();
}

load();

module.exports = {
  getSettings,
  setAdminRole,
  FILE_PATH,
};
