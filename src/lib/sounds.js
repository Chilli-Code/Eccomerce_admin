import { play, setEnabled, bind } from "cuelume";
import { RECIPES } from "cuelume/dist/sounds/recipes.js";

const VOLUME_BOOST = 1.8;
for (const recipe of Object.values(RECIPES)) {
  recipe.masterGain = Math.min(1, recipe.masterGain * VOLUME_BOOST);
}

const STORAGE_KEY = "sounds_enabled";

function getStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v !== null ? JSON.parse(v) : true;
  } catch {
    return true;
  }
}

let _enabled = getStored();
setEnabled(_enabled);

export function areSoundsEnabled() {
  return _enabled;
}

export function setSoundsEnabled(on) {
  _enabled = on;
  setEnabled(on);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(on));
  } catch {}
}

export function initSounds(root) {
  bind(root);
}

const SOUND_MAP = {
  success: "success",
  error: "error",
  warning: "droplet",
  info: "chime",
  loading: "loading",
  ready: "ready",
  toggle: "toggle",
  click: "press",
  notification: "sparkle",
};

export function playSound(type = "info") {
  const name = SOUND_MAP[type] || "chime";
  play(name);
}
