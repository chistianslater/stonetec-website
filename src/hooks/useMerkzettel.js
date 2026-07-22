import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  MAX_PICKS, STORAGE_KEY,
  getSnapshot, subscribe, syncFromStorage,
  toggle as toggleId, remove as removeIdFromStore, clear as clearStore, replaceAll as replaceAllInStore,
} from '../lib/merkzettel.js'

// Rückfallwert für das serverseitige Rendern: eine stabile Referenz, sonst
// würde useSyncExternalStore in eine Endlosschleife laufen.
const EMPTY = []

// Der Store füllt sich beim Laden des Moduls selbst aus dem localStorage —
// siehe merkzettel.js. Dieser Hook stellt ihn nur React zur Verfügung.
export function useMerkzettel() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)

  // Mehrere offene Tabs halten dieselbe Auswahl.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) syncFromStorage()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  return {
    ids,
    count: ids.length,
    has,
    isFull: ids.length >= MAX_PICKS,
    toggle: toggleId,
    remove: removeIdFromStore,
    clear: clearStore,
    replaceAll: replaceAllInStore,
  }
}
