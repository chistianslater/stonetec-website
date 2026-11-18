// Teilt den HTML-Inhalt eines Magazin-Artikels an der Markierung <!--cta-->,
// damit zwischen den Teilen ein React-CTA-Block gerendert werden kann.
// Ohne Markierung bleibt der Inhalt ungeteilt (CTA folgt dann am Ende).
export const CTA_MARKER = '<!--cta-->'

export function splitContentAtCta(content = '') {
  const index = content.indexOf(CTA_MARKER)
  if (index === -1) return { before: content, after: '', hasMarker: false }
  return {
    before: content.slice(0, index),
    after: content.slice(index + CTA_MARKER.length),
    hasMarker: true,
  }
}
