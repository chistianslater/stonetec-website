const schritte = [
  {
    titel: 'Erstberatung',
    text: 'Kostenlos und unverbindlich — im Showroom in Bocholt oder direkt bei dir. Wir hören zu, bevor wir planen.',
  },
  {
    titel: '3D-Planung',
    text: 'Du siehst dein neues Bad fotorealistisch, bevor der erste Stein bewegt wird. Materialien und Formate testest du virtuell.',
  },
  {
    titel: 'Festpreis-Angebot',
    text: 'Ein Angebot, ein Preis, keine versteckten Kosten. Dank Festpreis-Garantie weißt du vorher, was es kostet.',
  },
  {
    titel: 'Meisterhafte Umsetzung',
    text: 'Ein Team, ein Ansprechpartner, keine Subunternehmer. Termintreu und mit sauberer Baustelle.',
  },
]

// Nimmt Ad-Besuchern die größte Sorge: "Wochenlang Chaos, und wer koordiniert das?"
export default function ProzessSchritte() {
  return (
    <div>
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-inv-muted mb-4">
        So läuft&apos;s ab
      </p>
      <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-inv-light tracking-[-0.02em] leading-[1.05] mb-12">
        In vier Schritten zum neuen Bad.
      </h2>

      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {schritte.map((schritt, i) => (
          <li key={schritt.titel} className="relative">
            <span className="font-sora font-extralight text-5xl text-warm-stein/60 block mb-4">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-sora font-light text-xl text-inv-light mb-3">{schritt.titel}</h3>
            <p className="font-dm text-[0.9rem] text-inv-muted leading-relaxed">{schritt.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
