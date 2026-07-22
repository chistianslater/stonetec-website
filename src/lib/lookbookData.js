// Einzige Quelle für die Lookbook-Daten des Frontends.
//
// Kategorie-Metadaten (Titel, Untertitel, Beschreibung) bleiben bewusst im Code:
// der Admin verwaltet ausschließlich Fotos, damit die Seitenstruktur stabil bleibt.
// Die Bildlisten kommen zur Laufzeit aus /api/lookbook.php; schlägt das fehl,
// rendert die Seite die hier hinterlegten Bestandsbilder. Sie ist damit nie leer.

const MANIFEST_URL = '/api/lookbook.php'

export const SECTION_META = [
  {
    id: 'badezimmer',
    title: 'Badezimmer',
    subtitle: 'Räume der Ruhe',
    description: 'Von der fugenlosen Dusche bis zum monolithischen Waschtisch. Wir verwandeln Badezimmer in private Wellness-Oasen.',
  },
  {
    id: 'wohnraum',
    title: 'Wohnraum & Boden',
    subtitle: 'Weite und Beständigkeit',
    description: 'Großformatige Bodenbeläge schaffen eine durchgängige Optik und ein großzügiges Raumgefühl in jedem Wohnbereich.',
  },
  {
    id: 'terrasse',
    title: 'Terrasse & Pool',
    subtitle: 'Sommerliche Eleganz',
    description: 'Keramik im Außenbereich verbindet Ästhetik mit extremer Beständigkeit gegen Witterung und Frost.',
  },
  {
    id: 'manufaktur',
    title: 'Keramikmanufaktur',
    subtitle: 'Unikate aus Meisterhand',
    description: 'In unserer eigenen Manufaktur fertigen wir Waschtische, Treppenstufen und Sonderlösungen aus Keramik — passgenau für dein Projekt.',
  },
  {
    id: 'details',
    title: 'Details & Handwerk',
    subtitle: 'Präzision im Fokus',
    description: 'Wahre Meisterschaft zeigt sich im Detail. Wir legen Wert auf perfekte Kanten, saubere Fugen und eine durchdachte Planung.',
  },
]

// Die Bestandsbilder folgen einem festen Namensschema. Ihre IDs sind sprechend
// und damit garantiert identisch mit denen im Manifest auf dem Server — ohne
// Abgleich-Mechanik. Neu hochgeladene Bilder bekommen zufällige IDs aus PHP.
function legacyImages(dir, prefix, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${String(i + 1).padStart(2, '0')}`,
    src: `/images/lookbook/${dir}/stonetec-lookbook-${dir}-${i + 1}.jpg`,
    caption: '',
  }))
}

const LEGACY_IMAGES = {
  badezimmer: legacyImages('badezimmer', 'bad', 10),
  wohnraum: legacyImages('wohnraum', 'woh', 7),
  terrasse: legacyImages('terrasse', 'ter', 7),
  manufaktur: legacyImages('manufaktur', 'man', 7),
  details: legacyImages('details', 'det', 14),
}

export function fallbackSections() {
  return SECTION_META.map((meta) => ({ ...meta, images: [...LEGACY_IMAGES[meta.id]] }))
}

// Behält nur vollständige Einträge. Ein einzelner kaputter Datensatz im Manifest
// darf die gesamte Kategorie nicht mitreißen.
function sanitizeImages(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((img) => img && typeof img.id === 'string' && img.id !== ''
      && typeof img.src === 'string' && img.src !== '')
    .map((img) => ({
      id: img.id,
      src: img.src,
      caption: typeof img.caption === 'string' ? img.caption : '',
    }))
}

export function mergeManifest(manifest) {
  const raw = manifest?.sections
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallbackSections()

  const merged = SECTION_META.map((meta) => ({ ...meta, images: sanitizeImages(raw[meta.id]) }))

  // Eine einzelne leere Kategorie ist eine gültige Entscheidung des Betreibers.
  // Sind ausnahmslos alle leer, ist das Manifest kaputt oder noch nicht angelegt.
  const hasAnyImage = merged.some((section) => section.images.length > 0)
  return hasAnyImage ? merged : fallbackSections()
}

export async function loadLookbook(fetchImpl = globalThis.fetch) {
  try {
    const res = await fetchImpl(MANIFEST_URL, { headers: { Accept: 'application/json' } })
    if (!res.ok) return fallbackSections()
    return mergeManifest(await res.json())
  } catch {
    return fallbackSections()
  }
}
