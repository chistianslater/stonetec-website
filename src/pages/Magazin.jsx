import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'

/* ─── Reveal Component ───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Magazine Data ──────────────────────────────────────────── */
export const articles = [
  {
    id: 'grossformatfliesen-verlegen-in-bocholt',
    title: 'Großformatfliesen verlegen in Bocholt – Präzision, Technik und Meisterkompetenz',
    excerpt: 'Warum XXL-Fliesen mehr als nur ein Trend sind und welche technischen Herausforderungen sie an das Handwerk stellen.',
    category: 'Fachwissen',
    readTime: '10 Min.',
    date: 'Februar 2026',
    image: '/images/website-extract/Raumgefuehl-4-3.jpg',
    featured: true,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Sie möchten Großformatfliesen verlegen in Bocholt lassen und legen Wert auf ein modernes, nahezu fugenloses Design? Dann ist die Wahl des richtigen Fachbetriebs entscheidend. Denn während Großformatfliesen optisch für Eleganz und Großzügigkeit stehen, gehören sie technisch zu den anspruchsvollsten Disziplinen im Fliesenhandwerk.</p>
          <p>Das Großformatfliesen verlegen in Bocholt erfordert präzise Planung, absolut ebene Untergründe, spezielles Werkzeug und fundiertes Fachwissen. In diesem Beitrag erfahren Sie, worauf es wirklich ankommt, welche Herausforderungen auftreten können und warum professionelle Meisterarbeit hier unverzichtbar ist.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum Großformatfliesen so gefragt sind</h2>
          <p>Großformatige Fliesen – häufig in Formaten wie 80×80 cm, 100×100 cm oder 120×120 cm – sorgen für ein ruhiges, modernes Raumgefühl. Weniger Fugen bedeuten:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>eine großzügige, offene Raumwirkung</li>
            <li>leichtere Reinigung und geringere Schmutzanfälligkeit</li>
            <li>ein hochwertiges, minimalistisches Design</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Technik ist entscheidend</h2>
          <p>Je größer die Fliese, desto höher die Anforderungen an den Untergrund. Beim Großformatfliesen verlegen in Bocholt gelten strengere Toleranzen als bei Standardformaten. Entscheidend sind:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">perfekte Ebenheit des Untergrunds</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">fachgerechte Spachtelarbeiten</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">Buttering-Floating-Verfahren</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">Nivelliersysteme zur Höhenkontrolle</div>
          </div>
        </section>
        
        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Großformatfliesen verzeihen keine Fehler. Wahre Meisterschaft zeigt sich in der Vorbereitung."
        </blockquote>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Herausforderungen im Bad</h2>
          <p>Gerade im Bad ist das Großformatfliesen verlegen technisch anspruchsvoll. In Duschen müssen Gefälle exakt berechnet werden, damit Wasser zuverlässig abläuft. Ein professioneller Fachbetrieb achtet auf normgerechte Verbundabdichtung und saubere Silikonfugen.</p>
        </section>
      </div>
    `
  },
  {
    id: 'hochwertiger-fliesenleger',
    title: 'Hochwertiger Fliesenleger – Was macht ihn wirklich aus?',
    excerpt: 'Qualität im Handwerk ist messbar. Erfahren Sie, worauf Sie bei der Wahl Ihres Fliesenlegers achten sollten.',
    category: 'Unternehmen',
    readTime: '8 Min.',
    date: 'Januar 2026',
    image: '/images/website-extract/Raumgefuehl-8-2-scaled-1.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Die Suche nach einem hochwertigen Fliesenleger führt oft über Empfehlungen und Referenzen. Doch was unterscheidet einen Meisterbetrieb von einem Standard-Verleger? In Zeiten von Fachkräftemangel und schnellen Versprechen ist es wichtig, die Spreu vom Weizen zu trennen.</p>
          <p>Ein hochwertiger Fliesenleger ist mehr als nur ein Handwerker, der Platten an die Wand bringt. Er ist Berater, Planer und Ästhet in einem.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Qualität ist kein Zufall</h2>
          <p>Ein hochwertiger Fliesenleger zeichnet sich durch Beratungskompetenz, technisches Verständnis und Liebe zum Detail aus. Es geht nicht nur um das Kleben von Fliesen, sondern um das Schaffen von Werten, die Jahrzehnte überdauern.</p>
          
          <h3 className="text-xl font-medium mt-8 mb-4">Wichtige Kriterien bei der Wahl:</h3>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Transparente Angebotserstellung:</strong> Ein seriöser Betrieb arbeitet mit Pauschalpreisen und detaillierten Leistungsbeschreibungen. Keine versteckten Kosten, keine bösen Überraschungen am Ende.</li>
            <li><strong>Eigene Meister im Team:</strong> Achten Sie darauf, dass der Betrieb eigene Fliesenlegermeister beschäftigt und nicht nur auf Subunternehmer setzt. Nur so kann eine gleichbleibend hohe Qualität garantiert werden.</li>
            <li><strong>Moderne Werkzeuge:</strong> Die Verarbeitung von modernen Materialien wie XXL-Keramik erfordert Spezialwerkzeug (Vakuumheber, Schneidetische, Nivelliersysteme).</li>
            <li><strong>Umfassende Beratung:</strong> Ein guter Fliesenleger nimmt sich Zeit für Ihre Vision und berät Sie auch zu Themen wie Abdichtung, Gefälle und Materialeigenschaften.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Wir verkaufen keine Fliesen. Wir verkaufen das Gefühl, im richtigen Raum zu sein."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Nachhaltigkeit durch Meisterarbeit</h2>
          <p>Billig verlegt ist oft doppelt bezahlt. Wenn Fugen reißen, Wasser in den Untergrund dringt oder Fliesen hohl liegen, wird es teuer. Ein hochwertiger Fliesenleger investiert in die Vorbereitung des Untergrunds — denn das ist das Fundament für ein perfektes Ergebnis.</p>
        </section>
      </div>
    `
  },
  {
    id: 'fliesenberatung',
    title: 'Individuelle Fliesenberatung: Von der Idee zum Konzept',
    excerpt: 'Wie wir gemeinsam mit Ihnen Räume planen, die Ihre Persönlichkeit widerspiegeln.',
    category: 'Beratung',
    readTime: '5 Min.',
    date: 'Juni 2025',
    image: '/images/website-extract/Beratung-und-Konzeptentwicklung.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Jedes Projekt beginnt mit einem Gespräch. In unserer Ausstellung in Bocholt nehmen wir uns Zeit für Ihre Vision. Denn eine Fliese ist nicht einfach nur ein Belag — sie definiert die Atmosphäre Ihres Zuhauses.</p>
          <p>Oft kommen Kunden mit einer vagen Vorstellung zu uns. Unsere Aufgabe ist es, diese Idee in ein stimmiges Gesamtkonzept zu verwandeln.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Materialien erleben</h2>
          <p>Haptik kann man nicht digital vermitteln. Deshalb setzen wir auf echte Materialcollagen und Bemusterungen vor Ort. In unserem Showroom können Sie Oberflächen fühlen, Farben bei unterschiedlichem Licht vergleichen und Kombinationen ausprobieren.</p>
          <p>In intensiven Beratungsgesprächen entwickeln wir gemeinsam ein maßgeschneidertes Konzept, das Funktionalität und Ästhetik vereint. Dabei berücksichtigen wir nicht nur die Optik, sondern auch die Beanspruchung und Pflegeeigenschaften der Materialien.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Digitale Planung & 3D-Visualisierung</h2>
          <p>Dank modernster 3D-Visualisierungen können Sie Ihr Projekt bereits vor der Umsetzung realitätsnah erleben. Wir erstellen fotorealistische Renderings Ihres neuen Badezimmers oder Wohnraums.</p>
          <p>Das gibt Ihnen die Sicherheit, die richtigen Entscheidungen zu treffen. Sie sehen genau, wie das gewählte Format im Raum wirkt und wie die Fugenbilder verlaufen.</p>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Beratung bedeutet für uns, die richtigen Fragen zu stellen, bevor wir die erste Fliese verlegen."
        </blockquote>
      </div>
    `
  },
  {
    id: 'fugenloses-bad',
    title: 'Fugenloses Bad: Maximale Ruhe durch XXL-Keramik',
    excerpt: 'Fugenlose Flächen liegen im Trend. Erfahren Sie, wie wir mit großformatiger Keramik fugenlose Träume wahr machen.',
    category: 'Bad',
    readTime: '7 Min.',
    date: 'Mai 2025',
    image: '/images/website-extract/Perfekte-Linien_1-scaled.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Ein fugenloses Bad wirkt wie aus einem Guss. Es strahlt Ruhe aus, wirkt architektonisch modern und ist zudem extrem pflegeleicht. Doch wie erreicht man diesen Look, ohne auf die Vorteile von Keramik zu verzichten?</p>
          <p>Die Antwort liegt in der Verwendung von XXL-Großformaten, die wir in unserer Keramikmanufaktur individuell anpassen.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Die Rolle der XXL-Keramik</h2>
          <p>Mit Platten bis zu 3,20 Meter Höhe lassen sich Wände nahezu ohne horizontale Unterbrechung gestalten. Wo früher hunderte kleine Fugen das Auge ablenkten, entsteht heute eine homogene Fläche.</p>
          <p>Das Ergebnis ist eine ruhige Atmosphäre, die den Raum optisch vergrößert und eine exklusive Ästhetik schafft, die man sonst nur aus Luxushotels kennt.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vorteile auf einen Blick</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Hygiene:</strong> Wo keine Fugen sind, kann sich kein Schmutz oder Schimmel festsetzen. Die Reinigung wird zum Kinderspiel.</li>
            <li><strong>Langlebigkeit:</strong> Keramik ist im Gegensatz zu Spachteltechniken extrem robust, kratzfest und farbecht.</li>
            <li><strong>Ästhetik:</strong> Die durchgehende Maserung (Bookmatch-Effekt) sorgt für ein beeindruckendes visuelles Erlebnis.</li>
            <li><strong>Individualität:</strong> In unserer Manufaktur fertigen wir passend dazu Waschtische und Nischen aus demselben Material.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Ein fugenloses Bad ist kein Trend, sondern die logische Konsequenz aus modernem Design und praktischem Nutzen."
        </blockquote>
      </div>
    `
  },
  {
    id: 'keramikmanufaktur-unikate',
    title: 'Die Keramikmanufaktur: Wenn Standard nicht ausreicht',
    excerpt: 'Waschtische, Nischen und Sonderbauten aus Keramik. Erfahren Sie, was in unserer eigenen Fertigung möglich ist.',
    category: 'Handwerk',
    readTime: '6 Min.',
    date: 'März 2026',
    image: '/images/website-extract/KERAMIKMANUFAKTUR.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">In unserer eigenen Keramikmanufaktur in Bocholt machen wir das Unmögliche möglich. Wenn der Handel keine passenden Lösungen bietet, fertigen wir sie einfach selbst — auf den Millimeter genau.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Maßarbeit aus Meisterhand</h2>
          <p>Die Verarbeitung von großformatiger Keramik (SLABS) zu dreidimensionalen Objekten ist die Königsdisziplin unseres Handwerks. Wir fertigen:</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Individuelle Waschtische:</strong> Aus demselben Material wie Ihre Wandfliesen, für einen perfekten Monolith-Look.</li>
            <li><strong>Nischenlösungen:</strong> Passgenaue Ablagen für die Dusche, ohne unschöne Kunststoffprofile.</li>
            <li><strong>Küchenarbeitsplatten:</strong> Extrem robust, hitzebeständig und in exklusiven Designs.</li>
            <li><strong>Sonderbauten:</strong> Sitzbänke, Treppenstufen oder Kaminverkleidungen.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Der Prozess in der Manufaktur</h2>
          <p>Jedes Stück beginnt mit einer präzisen CAD-Planung. Die Platten werden mit Wasserstrahltechnik oder speziellen Präzisionsschneidern zugeschnitten und anschließend in Handarbeit verklebt und veredelt.</p>
          <p>Das Ergebnis sind Unikate, die es so kein zweites Mal gibt — "Made in Bocholt".</p>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Wir fangen da an, wo andere aufhören. Wenn es keine Lösung gibt, bauen wir sie."
        </blockquote>
      </div>
    `
  },
  {
    id: 'fliesen-in-holzoptik',
    title: 'Fliesen in Holzoptik – Die perfekte Symbiose',
    excerpt: 'Warum Holzoptik-Fliesen die ideale Wahl für wohnliche Räume mit den Vorteilen von Keramik sind.',
    category: 'Trends',
    readTime: '6 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/Combination-5.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Holz strahlt Wärme aus, Keramik bietet Beständigkeit. Fliesen in Holzoptik vereinen das Beste aus beiden Welten und sind heute von echtem Parkett kaum noch zu unterscheiden.</p>
          <p>Ob im Wohnzimmer, Bad oder sogar in der Dusche – die Einsatzmöglichkeiten sind nahezu grenzenlos. Dabei überzeugen sie nicht nur durch ihre Optik, sondern vor allem durch ihre technischen Vorteile gegenüber echtem Holz.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum Holzoptik-Fliesen die bessere Wahl sind</h2>
          <p>Echtes Holz ist wunderschön, aber empfindlich. Besonders in Feuchträumen oder bei Fußbodenheizungen stößt Naturholz oft an seine Grenzen. Keramik in Holzoptik löst diese Probleme elegant.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Pflegeleicht & Robust:</strong> Keine Kratzer durch Haustiere, kein Aufquellen bei Nässe.</li>
            <li><strong>Optimale Wärmeleitung:</strong> Ideal für Fußbodenheizungen durch geringen Wärmedurchlasswiderstand.</li>
            <li><strong>Langlebigkeit:</strong> Die Optik bleibt über Jahrzehnte unverändert – kein Abschleifen, kein Nachölen.</li>
            <li><strong>Hygiene:</strong> Bakterien und Milben haben auf der geschlossenen Keramikoberfläche keine Chance.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Holzoptik-Fliesen sind kein Kompromiss, sondern die intelligente Evolution des Wohnens."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Haptik und Optik auf Meister-Niveau</h2>
          <p>Moderne Fertigungsverfahren ermöglichen Oberflächen, die nicht nur wie Holz aussehen, sondern sich auch so anfühlen. Maserungen, Astlöcher und Strukturen werden täuschend echt nachgebildet. In Kombination mit schmalen, farblich abgestimmten Fugen entsteht ein Bodenbild, das selbst Experten erst auf den zweiten Blick als Fliese identifizieren.</p>
        </section>
      </div>
    `
  },
  {
    id: 'keramische-wandverkleidung',
    title: 'Keramische Wandverkleidung – Ästhetik trifft Funktion',
    excerpt: 'Großformatige Keramik an der Wand ist ein Statement. Erfahren Sie mehr über die Gestaltungsmöglichkeiten.',
    category: 'Trends',
    readTime: '5 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/MMD_3468-HDR.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Wände aus Keramik sind weit mehr als nur Spritzschutz. Sie sind architektonische Elemente, die Räumen Tiefe, Charakter und eine unvergleichliche Exklusivität verleihen.</p>
          <p>Mit großformatigen Platten (Slabs) verwandeln wir einfache Wandflächen in monolithische Kunstwerke. Ob im Bad, im Wohnbereich oder als repräsentative Wand im Flur – keramische Wandverkleidungen setzen neue Maßstäbe in der Innenarchitektur.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vorteile großformatiger Wandkeramik</h2>
          <p>Der Einsatz von XXL-Fliesen an der Wand bietet nicht nur ästhetische, sondern auch funktionale Vorzüge, die herkömmliche Materialien oft vermissen lassen.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Fugenlose Optik:</strong> Durch Formate bis zu 320 cm Höhe entstehen Flächen ohne horizontale Unterbrechungen.</li>
            <li><strong>Einfache Reinigung:</strong> Minimale Fugenanteile bedeuten weniger Angriffsfläche für Schmutz und Kalk.</li>
            <li><strong>Dünne Materialstärken:</strong> Mit nur 6 mm Dicke sind die Platten ideal für Sanierungen und Verkleidungen geeignet.</li>
            <li><strong>Individuelle Designs:</strong> Von edlem Marmor-Look bis hin zu rohem Beton oder oxidiertem Metall.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Eine Wand aus Keramik ist ein Statement für die Ewigkeit. Zeitlos, robust und absolut individuell."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Präzision in der Ausführung</h2>
          <p>Die Montage von großformatiger Wandkeramik erfordert höchste Präzision. Jede Bohrung für Armaturen, jeder Ausschnitt für Schalter muss perfekt sitzen. Als Meisterbetrieb garantieren wir eine millimetergenaue Verarbeitung und ein makelloses Finish, das Ihre Räume zum Strahlen bringt.</p>
        </section>
      </div>
    `
  },
  {
    id: 'wellnessbereich-planen',
    title: 'Wellnessbereich planen – Luxus für Zuhause',
    excerpt: 'Wie Sie Ihr eigenes Home-Spa mit den richtigen Materialien und einer durchdachten Planung realisieren.',
    category: 'Planung',
    readTime: '8 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/7920914_orig-Kopieren1.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Ein eigener Wellnessbereich ist der ultimative Rückzugsort. In einer hektischen Welt wird das Badezimmer immer mehr zum privaten Spa – ein Ort der Regeneration und Ruhe.</p>
          <p>Die Planung eines Home-Spas erfordert jedoch weit mehr als nur die Auswahl schöner Fliesen. Es geht um das Zusammenspiel von Licht, Wärme, Wasser und Materialität.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Die Säulen eines perfekten Home-Spas</h2>
          <p>Damit Ihr Wellnessbereich langfristig Freude bereitet, achten wir bei StoneTec auf eine ganzheitliche Planung.</p>
          <h3 className="text-xl font-medium mt-8 mb-4">Wichtige Planungsaspekte:</h3>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Materialwahl:</strong> Rutschhemmende Oberflächen sind in Nassbereichen Pflicht, ohne dabei die Ästhetik zu vernachlässigen.</li>
            <li><strong>Gefälleplanung:</strong> In bodengleichen Duschen und Wellnesszonen muss das Wasser unsichtbar, aber effektiv abgeleitet werden.</li>
            <li><strong>Beleuchtungskonzept:</strong> Indirektes Licht in Nischen und hinter Keramikwänden schafft Atmosphäre.</li>
            <li><strong>Integration von Technik:</strong> Dampfgeneratoren, Infrarotpaneele oder Schwallbrausen müssen technisch perfekt eingebunden werden.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Wellness beginnt im Kopf – und wird durch die richtige Umgebung spürbar."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Maßgeschneiderte Lösungen</h2>
          <p>In unserer Keramikmanufaktur fertigen wir passend zu Ihrem Wellnessbereich individuelle Sitzbänke, beheizte Liegen oder maßgeschneiderte Waschtische. So entsteht ein harmonisches Gesamtbild, das Professionalität und Luxus ausstrahlt.</p>
        </section>
      </div>
    `
  },
  {
    id: 'virtuelle-badplanung',
    title: 'Virtuelle Badplanung – Sicherheit bei jeder Entscheidung',
    excerpt: 'Erleben Sie Ihr neues Bad in 3D, bevor der erste Stein liegt. Warum digitale Planung heute Standard ist.',
    category: 'Bad',
    readTime: '7 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/Visu-1_2-1-scaled.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Keine bösen Überraschungen: Mit unserer virtuellen Badplanung sehen Sie exakt, wie Formate, Farben und Licht in Ihrem neuen Bad wirken, bevor der erste Handgriff erfolgt.</p>
          <p>Die Vorstellungskraft stößt bei komplexen Projekten oft an ihre Grenzen. Wie wirkt die XXL-Platte in einem kleinen Raum? Passt die Armatur zum gewählten Keramik-Design? Die virtuelle Planung gibt Ihnen die nötige Sicherheit.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vorteile der digitalen Vorplanung</h2>
          <p>Wir nutzen modernste Software, um Ihr Projekt fotorealistisch abzubilden. Das spart Zeit, vermeidet Fehlentscheidungen und optimiert den gesamten Bauprozess.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Realistische Visualisierung:</strong> Erleben Sie Lichtverhältnisse und Oberflächenstrukturen fast wie in der Realität.</li>
            <li><strong>Präzise Mengenermittlung:</strong> Weniger Verschnitt durch exakte digitale Kalkulation.</li>
            <li><strong>Fugenbild-Optimierung:</strong> Wir planen den Verlauf der Fugen so, dass ein harmonisches Gesamtbild entsteht.</li>
            <li><strong>Flexibilität:</strong> Verschiedene Materialkombinationen lassen sich per Mausklick vergleichen.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Planungssicherheit ist der Grundstein für ein entspanntes Bauvorhaben."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vom Entwurf zur Realität</h2>
          <p>Die virtuelle Planung dient unseren Meistern vor Ort als exakte Vorlage. So stellen wir sicher, dass das Ergebnis am Ende genau dem entspricht, was wir gemeinsam mit Ihnen entworfen haben. Das ist unser Anspruch an moderne Handwerksleistung.</p>
        </section>
      </div>
    `
  },
  {
    id: '3d-badplanung',
    title: '3D Badplanung – Detailverliebt bis zur letzten Fuge',
    excerpt: 'Warum wir jedes Projekt in 3D planen und wie Sie davon profitieren.',
    category: 'Bad',
    readTime: '6 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/Visu-6_1-1-scaled.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Präzision beginnt am Bildschirm. Unsere 3D-Badplanung ermöglicht ein exaktes Fugenbild und eine perfekte Anordnung aller Elemente – bis ins kleinste Detail.</p>
          <p>Bei StoneTec verstehen wir die 3D-Planung nicht nur als Verkaufsargument, sondern als essentielles Werkzeug für die handwerkliche Umsetzung auf Meister-Niveau.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum 3D für uns Standard ist</h2>
          <p>Ein Bad ist ein komplexes Gefüge aus Installationen, Abdichtungen und Oberflächen. Die 3D-Planung erlaubt es uns, potenzielle Konflikte bereits im Vorfeld zu erkennen und zu lösen.</p>
          <h3 className="text-xl font-medium mt-8 mb-4">Was wir in 3D für Sie planen:</h3>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Exakter Fliesenplan:</strong> Wir legen fest, wo die erste Fliese beginnt, um unschöne schmale Streifen an den Rändern zu vermeiden.</li>
            <li><strong>Nischen & Einbauten:</strong> Ablagen in der Dusche werden millimetergenau in das Fliesenraster integriert.</li>
            <li><strong>Lichtachsen:</strong> Wir visualisieren die Wirkung von Spots und LED-Bändern auf den gewählten Oberflächen.</li>
            <li><strong>Sanitärobjekte:</strong> Die Platzierung von Waschtisch, WC und Dusche wird ergonomisch und ästhetisch optimiert.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Wer im Kleinen nicht präzise plant, kann im Großen keine Perfektion erwarten."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Ihr Vorteil als Kunde</h2>
          <p>Sie erhalten ein klares Bild Ihres zukünftigen Badezimmers. Das gibt Ihnen nicht nur Sicherheit bei der Auswahl der Materialien, sondern auch die Gewissheit, dass die technische Umsetzung reibungslos verlaufen wird.</p>
        </section>
      </div>
    `
  },
  {
    id: 'hochwertige-fliesenverlegung',
    title: 'Hochwertige Fliesenverlegung – Handwerk auf Meister-Niveau',
    excerpt: 'Was echte Qualität bei der Verlegung ausmacht und warum wir keine Subunternehmer einsetzen.',
    category: 'Handwerk',
    readTime: '9 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/DSC_0137.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Qualität ist kein Zufall, sondern das Ergebnis von Erfahrung, Sorgfalt und den richtigen Werten. Hochwertige Fliesenverlegung bedeutet für uns: Handwerk auf Meister-Niveau ohne Kompromisse.</p>
          <p>In einer Zeit, in der Schnelligkeit oft vor Sorgfalt geht, setzen wir bewusst auf Beständigkeit. Wir verlegen nicht einfach nur Fliesen – wir schaffen bleibende Werte für Ihr Zuhause.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Was echte Meisterarbeit ausmacht</h2>
          <p>Die Unterschiede zwischen einer Standardverlegung und einer hochwertigen Ausführung zeigen sich oft erst im Detail – oder nach einigen Jahren.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Eigene Fachkräfte:</strong> Wir setzen ausschließlich auf fest angestellte Meister und Gesellen. Keine Subunternehmer-Ketten, volle Verantwortung.</li>
            <li><strong>Untergrundvorbereitung:</strong> Ein perfektes Ergebnis braucht ein perfektes Fundament. Wir prüfen und nivellieren jeden Untergrund akribisch.</li>
            <li><strong>Modernste Technik:</strong> Ob Vakuumheber für XXL-Slabs oder lasergestützte Vermessung – wir nutzen die besten Werkzeuge für beste Ergebnisse.</li>
            <li><strong>Normgerechte Abdichtung:</strong> Besonders im Bad ist die unsichtbare Arbeit unter der Fliese entscheidend für die Langlebigkeit.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Billig verlegt ist oft doppelt bezahlt. Wahre Qualität zeigt sich in der Dauerhaftigkeit."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Transparenz und Vertrauen</h2>
          <p>Wir kommunizieren ehrlich, was machbar ist und was nicht. Unsere Angebote sind detailliert und fair. Denn wir möchten, dass Sie auch nach zehn Jahren noch mit Stolz auf Ihre Fliesen blicken.</p>
        </section>
      </div>
    `
  },
  {
    id: 'selbstreinigende-fliesen',
    title: 'Selbstreinigende Fliesen – Mythos oder Realität?',
    excerpt: 'Wie moderne Oberflächenveredelungen die Reinigung erleichtern und für mehr Hygiene sorgen.',
    category: 'Bad',
    readTime: '5 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/BlackWhite_8.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Hydrophile Oberflächen und photokatalytische Effekte: Selbstreinigende Fliesen klingen nach Science-Fiction, sind aber bereits Realität. Doch was steckt wirklich hinter diesem Versprechen?</p>
          <p>Als Experten für moderne Keramik klären wir auf, wie diese Technologien funktionieren und wo ihr Einsatz wirklich sinnvoll ist.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Die Technik hinter der Sauberkeit</h2>
          <p>Es gibt zwei Hauptansätze, die Fliesen "selbstreinigend" oder zumindest extrem pflegeleicht machen.</p>
          <h3 className="text-xl font-medium mt-8 mb-4">Die wichtigsten Technologien:</h3>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Photokatalyse (Titandioxid):</strong> Durch Lichteinwirkung wird Sauerstoff aktiviert, der organische Schmutzpartikel und Bakterien zersetzt. Gleichzeitig wird die Oberfläche superhydrophil – Wasser perlt nicht ab, sondern bildet einen dünnen Film, der den gelösten Schmutz unterspült.</li>
            <li><strong>Silberionen-Veredelung:</strong> Diese wirkt permanent antibakteriell, auch ohne Lichteinfluss. Ideal für Badezimmer und Küchenhygiene.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Technologie ersetzt nicht die Pflege, aber sie reduziert den Aufwand auf ein Minimum."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vorteile im Alltag</h2>
          <p>Fliesen mit diesen Veredelungen bleiben länger sauber, reduzieren unangenehme Gerüche und verbessern die Lufthygiene. Besonders für Allergiker und Familien mit Kindern bieten sie einen echten Mehrwert. Wir beraten Sie gerne, welche Hersteller diese Innovationen auf Meister-Niveau umsetzen.</p>
        </section>
      </div>
    `
  },
  {
    id: 'waschtisch-aus-keramik',
    title: 'Waschtisch aus Keramik – Das Highlight im Bad',
    excerpt: 'Individuell gefertigte Waschtische aus großformatiger Keramik. Ein Unikat für Ihr Badezimmer.',
    category: 'Waschtisch',
    readTime: '6 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/BlackWhite_2.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Ein Waschtisch, der mit der Wand verschmilzt: Waschtische aus großformatiger Keramik sind das Highlight moderner Badarchitektur. Aus einem Guss, robust und in jedem Design realisierbar.</p>
          <p>In unserer Keramikmanufaktur fertigen wir diese Unikate individuell nach Ihren Wünschen. Vergessen Sie Standardmaße – wir bauen, was in Ihr Bad passt.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum Keramik das ideale Material ist</h2>
          <p>Im Vergleich zu Mineralguss oder Naturstein bietet High-End-Keramik entscheidende Vorteile für den täglichen Gebrauch am Waschplatz.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Absolute Porenfreiheit:</strong> Keine Flecken durch Kosmetika, Nagellackentferner oder Haarfärbemittel.</li>
            <li><strong>Kratzfestigkeit:</strong> Die Oberfläche ist extrem hart und widerstandsfähig.</li>
            <li><strong>Hitzebeständigkeit:</strong> Das Ablegen eines heißen Glätteisens ist völlig unproblematisch.</li>
            <li><strong>Design-Kontinuität:</strong> Nutzen Sie dasselbe Material für Boden, Wand und Waschtisch für einen monolithischen Look.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Ein maßgefertigter Keramik-Waschtisch ist kein Möbelstück, sondern Teil der Architektur."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Handwerkliche Perfektion</h2>
          <p>Die Fertigung erfordert spezielles Know-how bei der Gehrungssägung und Verklebung. Unsere Manufaktur-Experten sorgen für unsichtbare Übergänge und eine perfekte Haptik. So entsteht ein funktionales Kunstwerk, das jeden Morgen aufs Neue begeistert.</p>
        </section>
      </div>
    `
  },
  {
    id: 'fliesenideen-2025',
    title: 'Fliesenideen 2025 – Die Trends von morgen',
    excerpt: 'Welche Farben, Formate und Strukturen das Jahr 2025 prägen werden.',
    category: 'Trends',
    readTime: '7 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/DSC_1243.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Natürlichkeit, Mut zur Farbe und XXL-Formate: Wir werfen einen Blick in die Zukunft der Raumgestaltung. Was wird 2025 die Badezimmer und Wohnräume prägen?</p>
          <p>Trends kommen und gehen, aber die Richtung für das nächste Jahr ist klar: Es geht um Authentizität und das Erleben von Oberflächen.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Die Top-Trends für 2025</h2>
          <p>Wir haben die internationalen Messen analysiert und die wichtigsten Strömungen für Sie zusammengefasst.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Warme Minimalistik:</strong> Statt kühlem Grau dominieren warme Beigetöne, Sandfarben und erdige Nuancen ("Greige" wird sanfter).</li>
            <li><strong>Taktile Oberflächen:</strong> Fliesen, die man berühren möchte. Strukturierte Oberflächen, die Naturstein oder handgeschöpftem Putz nachempfunden sind.</li>
            <li><strong>Großformate 2.0:</strong> Die XXL-Platte wird zum Standard. Fugenlose Wände in Marmor- oder Onyx-Optik setzen luxuriöse Akzente.</li>
            <li><strong>Biophilic Design:</strong> Keramik in tiefen Grüntönen oder mit floralen Dekoren bringt die Natur ins Haus.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Trends sind Inspiration, aber zeitloses Design ist das Ziel."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Individuelle Umsetzung</h2>
          <p>Bei aller Begeisterung für Trends: Wichtig ist, dass das Konzept zu Ihnen und Ihrer Immobilie passt. In unserer Beratung helfen wir Ihnen, die aktuellen Ideen so zu interpretieren, dass sie auch in vielen Jahren noch modern wirken.</p>
        </section>
      </div>
    `
  },
  {
    id: 'nachhaltige-fliesen',
    title: 'Nachhaltige Fliesen – Ökologisch bauen mit Keramik',
    excerpt: 'Warum Keramik einer der nachhaltigsten Baustoffe ist und worauf Sie beim Kauf achten sollten.',
    category: 'Unternehmen',
    readTime: '6 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/BlackWhite_8.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Langlebigkeit ist die ehrlichste Form der Nachhaltigkeit. Keramik punktet zudem mit natürlichen Rohstoffen und hervorragender Recyclingfähigkeit. Wer heute baut, muss an morgen denken.</p>
          <p>Fliesen sind von Natur aus eines der umweltfreundlichsten Baumaterialien, wenn man den gesamten Lebenszyklus betrachtet.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum Keramik ökologisch überzeugt</h2>
          <p>Nachhaltiges Bauen bedeutet, Materialien zu wählen, die Ressourcen schonen und gesundes Wohnen ermöglichen.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Natürliche Rohstoffe:</strong> Ton, Quarz und Feldspat sind reichlich vorhanden und kommen ohne chemische Zusätze aus.</li>
            <li><strong>Emissionsfrei:</strong> Fliesen dünsten keine Schadstoffe (VOCs) aus und sind absolut geruchsneutral.</li>
            <li><strong>Energiespeicher:</strong> In Kombination mit Fußbodenheizungen dienen Fliesen als effizienter Wärmespeicher.</li>
            <li><strong>Extreme Lebensdauer:</strong> Ein Fliesenboden hält oft 30, 40 oder mehr Jahre – das spart Ressourcen für Neuanschaffungen.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Nachhaltigkeit bedeutet, Dinge so gut zu machen, dass man sie nicht ersetzen muss."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Verantwortung beim Kauf</h2>
          <p>Wir achten bei der Auswahl unserer Lieferanten auf kurze Transportwege und zertifizierte Umweltstandards in der Produktion. So stellen wir sicher, dass Ihre Entscheidung für Fliesen auch eine Entscheidung für die Umwelt ist.</p>
        </section>
      </div>
    `
  },
  {
    id: 'xxl-keramikfliesen',
    title: 'XXL Keramikfliesen – Grenzenlose Gestaltung',
    excerpt: 'Die Faszination der großen Fläche. Alles über Formate bis 160 x 320 cm.',
    category: 'Fachwissen',
    readTime: '8 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/MMD_6413-HDR.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Großformate sind mehr als nur große Fliesen. Sie verändern die Architektur eines Raumes grundlegend. Mit Formaten bis zu 160 x 320 cm stoßen wir in neue Dimensionen der Gestaltung vor.</p>
          <p>Die Faszination der großen Fläche liegt in ihrer Ruhe und Souveränität. Wo keine Fugen das Auge ablenken, kann das Material seine volle Wirkung entfalten.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Einsatzgebiete von XXL-Keramik</h2>
          <p>Dank moderner Produktionstechniken sind diese "Slabs" trotz ihrer Größe nur 6 bis 12 mm dick und damit vielseitig einsetzbar.</p>
          <ul className="list-disc pl-6 space-y-4 mt-6">
            <li><strong>Fugenlose Duschwände:</strong> Eine Platte pro Wand – hygienischer und ästhetischer geht es nicht.</li>
            <li><strong>Großzügige Bodenflächen:</strong> Räume wirken optisch deutlich größer und offener.</li>
            <li><strong>Kücheninseln:</strong> Keramik als robustes und hitzebeständiges Oberflächenmaterial für die moderne Küche.</li>
            <li><strong>Fassadengestaltung:</strong> Auch im Außenbereich setzen XXL-Formate architektonische Highlights.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Größe allein ist kein Wert, aber die Freiheit, die sie in der Gestaltung ermöglicht, ist unbezahlbar."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Meisterhafte Logistik und Verlegung</h2>
          <p>Der Umgang mit XXL-Platten verzeiht keine Fehler. Von der speziellen Transportlogistik bis zur Verlegung mit Vakuum-Saugrahmen ist absolute Professionalität gefragt. Als spezialisierter Fachbetrieb beherrschen wir diese Prozesse sicher.</p>
        </section>
      </div>
    `
  },
  {
    id: 'grossformatige-fliesen',
    title: 'Großformatige Fliesen – Worauf es bei der Planung ankommt',
    excerpt: 'Technische Details und Planungstipps für den Einsatz von XXL-Platten.',
    category: 'Fachwissen',
    readTime: '7 Min.',
    date: 'Juni 2025',
    image: 'https://stonetec-bocholt.de/wp-content/uploads/2025/06/MMD_2997-HDR-th.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Vom Untergrund bis zum Fugenbild: Großformatige Fliesen erfordern eine akribische Planung. Wir erklären die technischen Voraussetzungen für ein perfektes Ergebnis mit XXL-Platten.</p>
          <p>Wer sich für Großformate entscheidet, wählt Ästhetik auf höchstem Niveau. Damit diese auch dauerhaft erhalten bleibt, müssen im Vorfeld einige kritische Punkte beachtet werden.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Technische Checkliste für Großformate</h2>
          <p>Beim Einsatz von Platten ab 80x80 cm steigen die Anforderungen an das Handwerk exponentiell.</p>
          <h3 className="text-xl font-medium mt-8 mb-4">Worauf es ankommt:</h3>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Untergrund-Ebenheit:</strong> Die Toleranzen nach DIN 18202 sind für Großformate oft nicht ausreichend. Wir arbeiten mit erhöhten Anforderungen an die Ebenheit.</li>
            <li><strong>Haftverbund:</strong> Das Buttering-Floating-Verfahren (beidseitiger Kleberauftrag) ist zwingend erforderlich, um Hohlstellen zu vermeiden.</li>
            <li><strong>Dehnungsfugen:</strong> Trotz großem Format müssen Spannungen im Untergrund durch intelligent platzierte Fugen abgefangen werden.</li>
            <li><strong>Spezialkleber:</strong> Hochflexible S2-Kleber sind notwendig, um die thermischen Spannungen der großen Platten auszugleichen.</li>
          </ul>
        </section>

        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Die Planung eines Großformat-Projekts ist wie ein Uhrwerk – jedes Detail muss ins andere greifen."
        </blockquote>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Beratung ist der Schlüssel</h2>
          <p>Wir prüfen bereits in der Planungsphase die Gegebenheiten vor Ort. Passt die Platte durch das Treppenhaus? Ist der Estrich ausreichend belegt? Wir klären diese Fragen, bevor Probleme entstehen.</p>
        </section>
      </div>
    `
  }
]

const categories = ['Alle', 'Fachwissen', 'Handwerk', 'Unternehmen', 'Beratung', 'Bad', 'Trends', 'Planung', 'Waschtisch']

/* ─── Article Card Component ─────────────────────────────────── */
function ArticleCard({ article, index, featured = false }) {
  if (featured) {
    return (
      <Reveal delay={index * 0.1}>
        <Link to={`/magazin/${article.id}`} className="group block">
          <article className="grid lg:grid-cols-2 gap-8 bg-dark-bg rounded-[2rem] overflow-hidden shadow-xl">
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-inv-light/10 font-dm text-[0.7rem] text-inv-mid uppercase tracking-[2px]">
                  {article.category}
                </span>
                <span className="font-dm text-[0.75rem] text-inv-tagline uppercase tracking-widest">{article.readTime} Lesezeit</span>
              </div>
              <h2 className="font-sora font-extralight text-2xl md:text-4xl text-inv-light tracking-tight mb-6 leading-tight">
                {article.title}
              </h2>
              <p className="font-dm text-[1.05rem] text-inv-muted leading-relaxed mb-8">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 font-dm text-[0.82rem] font-semibold text-inv-light uppercase tracking-widest group-hover:text-white transition-colors">
                <span>Beitrag lesen</span>
                <motion.div 
                  className="w-8 h-[1px] bg-inv-light/50"
                  whileHover={{ width: 48 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </article>
        </Link>
      </Reveal>
    )
  }

  return (
    <Reveal delay={index * 0.1}>
      <Link to={`/magazin/${article.id}`} className="group block">
        <article className="h-full">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-sm">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-warm-bg/90 backdrop-blur-sm font-dm text-[0.65rem] text-warm-text uppercase tracking-[2px]">
                {article.category}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-warm-mittel">
              <span className="font-dm text-[0.7rem] uppercase tracking-widest">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-warm-stein/30" />
              <span className="font-dm text-[0.7rem] uppercase tracking-widest">{article.readTime}</span>
            </div>
            <h3 className="font-sora font-light text-xl text-warm-text tracking-tight leading-snug group-hover:text-warm-anthrazit transition-colors">
              {article.title}
            </h3>
            <p className="font-dm text-[0.9rem] text-warm-mittel leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Magazin() {
  const [filter, setFilter] = useState('Alle')
  
  const featuredArticle = articles.find(a => a.featured)
  const filteredArticles = filter === 'Alle' 
    ? articles.filter(a => !a.featured)
    : articles.filter(a => a.category === filter && !a.featured)

  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title="Magazin — Wissen & Inspiration"
        description="Fachwissen, Einblicke und Inspiration aus der Welt der Premium-Fliesenverlegung. Ehrlich, kompetent und auf den Punkt."
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Wissen & Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,8vw,6rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl mb-8">
            Unser Magazin.
          </h1>
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Fachwissen, Einblicke und Inspiration aus der Welt der Premium-Fliesenverlegung. Ehrlich, kompetent und auf den Punkt.
          </p>
        </Reveal>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex flex-wrap gap-2 border-b border-warm-anthrazit/10 pb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 font-dm text-[0.82rem] font-semibold tracking-wider uppercase transition-all duration-500 relative ${
                filter === cat 
                  ? 'text-warm-text' 
                  : 'text-warm-mittel hover:text-warm-text'
              }`}
            >
              {cat}
              {filter === cat && (
                <motion.div 
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-stein"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && filter === 'Alle' && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-20">
          <ArticleCard article={featuredArticle} index={0} featured />
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-32">
        <Reveal>
          <div className="bg-dark-bg rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-sora font-extralight text-3xl md:text-4xl text-inv-light tracking-tight mb-4">
                  Bleiben Sie informiert.
                </h2>
                <p className="font-dm text-[1rem] text-inv-muted leading-relaxed">
                  Einmal im Monat: Fachwissen, Projekt-Einblicke und Inspiration direkt in Ihr Postfach. Kein Spam, nur Relevanz.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-none font-dm text-[0.95rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none whitespace-nowrap"
                >
                  Anmelden
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
