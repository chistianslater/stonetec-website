// Merkzettel: die Bildauswahl des Besuchers.
//
// Liegt ausschließlich im Browser (localStorage) — es geht nichts an den Server,
// solange der Besucher nicht selbst eine Anfrage absendet. Der Speicher erfüllt
// damit genau die Funktion, die der Nutzer angefordert hat, und ist nach
// § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.
//
// Bewusst ein eigener kleiner Store statt React-Context: die Auswahl wird auf
// jeder Bildkachel gelesen, und ein Context würde bei jedem Herz-Klick den
// gesamten Teilbaum neu rendern. useSyncExternalStore rendert nur die
// Komponenten neu, die wirklich abonniert haben.

export const MAX_PICKS = 40
export const STORAGE_KEY = 'stonetec:merkzettel'

// Bestands-IDs sind 5 Zeichen (bad01), neue ebenfalls. Der weitere Rahmen
// verträgt spätere Formatänderungen, ohne alte Links zu brechen.
const ID_PATTERN = /^[a-z0-9]{2,12}$/

export function sanitizeIds(value, max = MAX_PICKS) {
  if (!Array.isArray(value)) return []
  const out = []
  const seen = new Set()
  for (const raw of value) {
    if (typeof raw !== 'string' || !ID_PATTERN.test(raw) || seen.has(raw)) continue
    seen.add(raw)
    out.push(raw)
    if (out.length >= max) break
  }
  return out
}

export function addId(ids, id, max = MAX_PICKS) {
  if (typeof id !== 'string' || !ID_PATTERN.test(id)) return ids
  if (ids.includes(id) || ids.length >= max) return ids
  return [...ids, id]
}

export function removeId(ids, id) {
  if (!ids.includes(id)) return ids
  return ids.filter((entry) => entry !== id)
}

export function parseStored(raw) {
  if (typeof raw !== 'string' || raw === '') return []
  try {
    return sanitizeIds(JSON.parse(raw))
  } catch {
    return []
  }
}

/* ─── Store ──────────────────────────────────────────────────── */

let storageRef = null
let current = []
const listeners = new Set()

function readStorage() {
  if (!storageRef) return []
  try {
    return parseStored(storageRef.getItem(STORAGE_KEY))
  } catch {
    // Safari im privaten Modus wirft beim Zugriff. Der Merkzettel arbeitet dann
    // nur für die Dauer des Seitenbesuchs — das ist besser als ein Absturz.
    return []
  }
}

function writeStorage(ids) {
  if (!storageRef) return
  try {
    storageRef.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // siehe oben
  }
}

function commit(next) {
  if (next === current) return
  current = next
  writeStorage(current)
  for (const listener of listeners) listener()
}

function defaultStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export function initMerkzettel(storage = defaultStorage()) {
  storageRef = storage ?? null
  current = readStorage()
  for (const listener of listeners) listener()
}

/** Stabile Referenz — Voraussetzung für useSyncExternalStore. */
export function getSnapshot() {
  return current
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isFull() {
  return current.length >= MAX_PICKS
}

/** @returns {boolean} true, wenn das Bild jetzt gemerkt ist. */
export function toggle(id) {
  if (current.includes(id)) {
    commit(removeId(current, id))
    return false
  }
  commit(addId(current, id))
  // Nach dem Commit steht in `current` das Ergebnis — bei voller Liste
  // unverändert, sonst mit der neuen ID.
  return current.includes(id)
}

export function remove(id) {
  commit(removeId(current, id))
}

export function clear() {
  commit(current.length === 0 ? current : [])
}

export function replaceAll(ids) {
  const next = sanitizeIds(ids)
  if (next.length === current.length && next.every((id, i) => id === current[i])) return
  commit(next)
}

/** Für das storage-Event: übernimmt Änderungen aus anderen Tabs. */
export function syncFromStorage() {
  const next = readStorage()
  if (next.length === current.length && next.every((id, i) => id === current[i])) return
  commit(next)
}

// Im Browser einmal beim Laden des Moduls aus dem Speicher füllen. Bewusst hier
// und nicht im Hook: eine Initialisierung während des Renderns wäre ein
// Seiteneffekt und unter nebenläufigem Rendering nicht vorhersagbar.
// In der Node-Testumgebung passiert nichts — dort ruft jeder Test initMerkzettel
// selbst mit seinem eigenen Speicher auf.
if (typeof window !== 'undefined') {
  initMerkzettel()
}
