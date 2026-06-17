import OptionCard from './OptionCard.jsx'
import Chip from './Chip.jsx'

const inputCls =
  'w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors'
const labelCls = 'block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2'

const VORHABEN = [
  { value: 'neubau', label: 'Neubau', hint: 'Neu fliesen von Grund auf' },
  { value: 'sanierung', label: 'Sanierung', hint: 'Bestehendes erneuern' },
  { value: 'reparatur', label: 'Reparatur', hint: 'Ausbessern / einzelne Stellen' },
]
const BEREICH = [
  { value: 'bad', label: 'Badezimmer' },
  { value: 'kueche', label: 'Küche' },
  { value: 'wohnbereich', label: 'Wohnbereich' },
  { value: 'aussen', label: 'Außen & Terrasse' },
  { value: 'gewerbe', label: 'Gewerbe' },
  { value: 'sonstiges', label: 'Sonstiges' },
]
const WEEKDAYS = [
  { value: 'mo', label: 'Mo' }, { value: 'di', label: 'Di' }, { value: 'mi', label: 'Mi' },
  { value: 'do', label: 'Do' }, { value: 'fr', label: 'Fr' }, { value: 'sa', label: 'Sa' },
]
const DAYTIMES = [
  { value: 'vormittags', label: 'Vormittags' },
  { value: 'nachmittags', label: 'Nachmittags' },
]

function StepTitle({ kicker, title }) {
  return (
    <div className="mb-6">
      <p className="font-dm text-[0.7rem] uppercase tracking-[2px] text-inv-tagline mb-2">{kicker}</p>
      <h3 className="font-sora font-extralight text-[1.6rem] text-inv-light tracking-[-0.01em]">{title}</h3>
    </div>
  )
}

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function StepVorhaben({ data, update, onAdvance }) {
  return (
    <div>
      <StepTitle kicker="Dein Projekt" title="Was ist geplant?" />
      <div className="grid gap-3">
        {VORHABEN.map((o) => (
          <OptionCard key={o.value} label={o.label} hint={o.hint} selected={data.vorhaben === o.value}
            onClick={() => { update('vorhaben', o.value); onAdvance?.() }} />
        ))}
      </div>
    </div>
  )
}

export function StepBereich({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Dein Projekt" title="Welche Bereiche?" />
      <p className="font-dm text-[0.82rem] text-inv-muted -mt-3 mb-5">Mehrfachauswahl möglich — wähle alles, was zum Projekt gehört.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BEREICH.map((o) => (
          <OptionCard key={o.value} label={o.label} selected={data.bereich.includes(o.value)}
            onClick={() => update('bereich', toggle(data.bereich, o.value))} />
        ))}
      </div>
    </div>
  )
}

export function StepOrt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Standort" title="Wo ist das Bauvorhaben?" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <label htmlFor="zipcode" className={labelCls}>PLZ *</label>
          <input id="zipcode" name="zipcode" inputMode="numeric" required value={data.zipcode}
            onChange={(e) => update('zipcode', e.target.value)} className={inputCls} placeholder="46399" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="city" className={labelCls}>Ort</label>
          <input id="city" name="city" value={data.city}
            onChange={(e) => update('city', e.target.value)} className={inputCls} placeholder="Bocholt" />
        </div>
      </div>
    </div>
  )
}

export function StepProjekt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Details" title="Erzähl uns kurz davon" />
      <label htmlFor="message" className={labelCls}>Beschreibung (optional)</label>
      <textarea id="message" name="message" rows={5} value={data.message}
        onChange={(e) => update('message', e.target.value)}
        className={`${inputCls} resize-none`}
        placeholder="Größe, Wünsche, Material, Zeitvorstellung … Wenn du Fotos vom Projekt hast, erwähn es gern — wir kommen darauf zurück." />
      {/* Bild-Upload temporär deaktiviert: Hero-Bildformat ist nicht dokumentiert und noch
          nicht vom Hero-Support bestätigt. Vollständige Upload-UI + imagePrep siehe Commit
          9d4411b bzw. Plan Task 10 — Re-Aktivierung ist eine kleine Änderung, sobald das
          images-Format feststeht. */}
    </div>
  )
}

export function StepTermin({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Erreichbarkeit" title="Wann passt es dir?" />
      <p className="font-dm text-[0.82rem] text-inv-muted -mt-3 mb-5 leading-relaxed">
        Nur deine grobe Präferenz — den genauen Termin stimmen wir anschließend telefonisch mit dir ab.
      </p>
      <p className={labelCls}>Wochentage</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {WEEKDAYS.map((d) => (
          <Chip key={d.value} label={d.label} selected={data.weekdays.includes(d.value)}
            onClick={() => update('weekdays', toggle(data.weekdays, d.value))} />
        ))}
      </div>
      <p className={labelCls}>Tageszeit</p>
      <div className="flex flex-wrap gap-2">
        {DAYTIMES.map((t) => (
          <Chip key={t.value} label={t.label} selected={data.daytimes.includes(t.value)}
            onClick={() => update('daytimes', toggle(data.daytimes, t.value))} />
        ))}
      </div>
    </div>
  )
}

export function StepKontakt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Fast geschafft" title="Wie erreichen wir dich?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelCls}>Vorname *</label>
          <input id="firstName" required value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)} className={inputCls} placeholder="Anna" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Nachname *</label>
          <input id="lastName" required value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)} className={inputCls} placeholder="Schmidt" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>E-Mail *</label>
          <input id="email" type="email" required value={data.email}
            onChange={(e) => update('email', e.target.value)} className={inputCls} placeholder="anna@email.de" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Telefon</label>
          <input id="phone" type="tel" value={data.phone}
            onChange={(e) => update('phone', e.target.value)} className={inputCls} placeholder="+49 …" />
        </div>
      </div>
      {/* Honeypot — für Menschen unsichtbar */}
      <input type="text" tabIndex={-1} autoComplete="off" value={data.company}
        onChange={(e) => update('company', e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      <div className="flex items-start gap-3 pt-5">
        <input id="privacy" type="checkbox" checked={data.privacy}
          onChange={(e) => update('privacy', e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-inv-light/20 bg-inv-light/10" />
        <label htmlFor="privacy" className="font-dm text-[0.8rem] text-inv-muted leading-relaxed">
          Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu. *
        </label>
      </div>
    </div>
  )
}
