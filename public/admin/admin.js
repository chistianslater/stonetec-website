// Bedienlogik des Lookbook-Admins: Bildunterschrift speichern, Reihenfolge per
// Ziehen ändern, Foto löschen. Alles ohne Seitenneuladen — der Betreiber soll
// auf dem Handy zügig durch viele Fotos kommen.
(function () {
  'use strict'

  const statusleiste = document.getElementById('statusleiste')
  let statusTimer = null

  function melden(text, istFehler) {
    statusleiste.textContent = text
    statusleiste.classList.toggle('fehlerhaft', Boolean(istFehler))
    statusleiste.hidden = false
    clearTimeout(statusTimer)
    statusTimer = setTimeout(() => { statusleiste.hidden = true }, 2500)
  }

  async function senden(felder) {
    const body = new FormData()
    body.append('csrf', window.ADMIN_CSRF)
    body.append('ajax', '1')
    for (const [name, wert] of Object.entries(felder)) body.append(name, wert)

    try {
      const res = await fetch('actions.php', { method: 'POST', body })
      const daten = await res.json().catch(() => ({ ok: false, message: 'Unerwartete Antwort.' }))
      melden(daten.message || (daten.ok ? 'Gespeichert.' : 'Fehlgeschlagen.'), !daten.ok)
      return Boolean(daten.ok)
    } catch {
      melden('Keine Verbindung zum Server.', true)
      return false
    }
  }

  /* Bildunterschrift — speichern, wenn das Feld verlassen wird und sich der
     Text tatsächlich geändert hat. */
  document.querySelectorAll('input.caption').forEach((feld) => {
    let letzter = feld.value
    feld.addEventListener('blur', async () => {
      if (feld.value === letzter) return
      const ok = await senden({ action: 'caption', id: feld.dataset.id, caption: feld.value })
      if (ok) letzter = feld.value
      else feld.value = letzter
    })
    feld.addEventListener('keydown', (e) => { if (e.key === 'Enter') feld.blur() })
  })

  /* Löschen */
  document.querySelectorAll('button.loeschen').forEach((knopf) => {
    knopf.addEventListener('click', async () => {
      if (!window.confirm('Dieses Foto wirklich löschen?')) return
      const ok = await senden({ action: 'delete', id: knopf.dataset.id })
      if (ok) knopf.closest('li.foto').remove()
    })
  })

  /* Reihenfolge per Ziehen */
  document.querySelectorAll('section.kategorie').forEach((bereich) => {
    const liste = bereich.querySelector('ul.fotos')
    if (!liste) return
    let gezogen = null

    liste.addEventListener('dragstart', (e) => {
      gezogen = e.target.closest('li.foto')
      if (gezogen) gezogen.classList.add('zieht')
    })

    liste.addEventListener('dragover', (e) => {
      e.preventDefault()
      const ziel = e.target.closest('li.foto')
      if (!ziel || !gezogen || ziel === gezogen) return
      const rechteck = ziel.getBoundingClientRect()
      const dahinter = (e.clientY - rechteck.top) > rechteck.height / 2
      liste.insertBefore(gezogen, dahinter ? ziel.nextSibling : ziel)
    })

    liste.addEventListener('dragend', async () => {
      if (!gezogen) return
      gezogen.classList.remove('zieht')
      gezogen = null
      const order = Array.from(liste.querySelectorAll('li.foto')).map((li) => li.dataset.id).join(',')
      await senden({ action: 'sort', section: bereich.dataset.section, order })
    })
  })
})()
