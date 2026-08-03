// Ratgeber-Artikel, die die Alt-URLs der Vorgängerseite retten:
// /die-fugenfarbe und /wie-finde-ich-das-passende-fliesenformat ranken bei
// Google (u. a. „fliesengrößen bad", „silbergraue fugen", „fugenfarben
// tabelle"), existierten auf der neuen Seite aber nicht mehr (Soft-404 über
// den :slug-Catch-all). Die Alt-URLs werden per .htaccess 301 auf diese
// Magazin-Beiträge umgeleitet.
// Format identisch zu den Artikeln in pages/Magazin.jsx (dort importiert).

export const ratgeberArticles = [
  {
    id: 'die-fugenfarbe',
    title: 'Die Fugenfarbe: Welche Fuge passt zu welcher Fliese? (mit Tabelle)',
    excerpt: 'Silbergrau, beige oder Ton-in-Ton? Warum die Fugenfarbe die Wirkung deiner Fliesen bestimmt — mit Tabelle für alle gängigen Fliesenfarben.',
    category: 'Fachwissen',
    readTime: '9 Min.',
    date: 'August 2026',
    image: '/images/projekte/Derksen/stonetec-projekt-derksen-1.jpg',
    featured: false,
    content: `
      <div class="space-y-12">
        <section>
          <p class="text-xl leading-relaxed mb-8">Die Fugenfarbe ist die am meisten unterschätzte Entscheidung bei jedem Fliesenprojekt. Dieselbe Fliese wirkt mit silbergrauen Fugen ruhig und großzügig — und mit dunklem Kontrast plötzlich grafisch und kleinteilig. Wer die Fugenfarbe erst auf der Baustelle entscheidet, verschenkt Wirkung.</p>
          <p>In diesem Ratgeber erfährst du, nach welchen Regeln wir als Meisterbetrieb Fugenfarben auswählen, welche Fugenfarbe zu welcher Fliese passt (Tabelle) und welche Fehler du vermeiden solltest.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Die Grundregel: Ton-in-Ton oder Kontrast</h2>
          <p>Es gibt zwei Grundstrategien:</p>
          <ul class="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Ton-in-Ton:</strong> Die Fuge liegt farblich nah an der Fliese. Die Fläche wirkt ruhig, großzügig und nahezu fugenlos — die Wirkung, die sich die meisten für Bad und Wohnbereich wünschen.</li>
            <li><strong>Kontrast:</strong> Die Fuge setzt sich bewusst ab (z. B. dunkle Fuge auf heller Metrofliese). Das Fugenraster wird zum Gestaltungselement — wirkungsvoll, aber es betont jede Linie und verkleinert optisch.</li>
          </ul>
          <p class="mt-4">Faustregel aus der Praxis: Im Zweifel eine halbe bis eine Nuance <em>dunkler</em> als die Fliese wählen. Reinweiße Fugen vergrauen im Gebrauch und wirken schnell ungepflegt — deshalb ist Silbergrau der bessere „Weiß-Ersatz".</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Fugenfarben-Tabelle: Welche Fugenfarbe zu welcher Fliese?</h2>
          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Fliese</th>
                  <th>Empfohlene Fugenfarbe</th>
                  <th>Wirkung</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weiße Fliesen</td>
                  <td>Silbergrau, Hellgrau (statt Reinweiß)</td>
                  <td>Ruhig und pflegeleicht — Reinweiß vergilbt/vergraut sichtbar</td>
                </tr>
                <tr>
                  <td>Beige &amp; Creme-Fliesen</td>
                  <td>Beige, Sandgrau, Jasmin — Ton-in-Ton</td>
                  <td>Warm und flächig; graue Fugen lassen Beige schmutzig wirken</td>
                </tr>
                <tr>
                  <td>Graue Fliesen / Betonoptik</td>
                  <td>Zementgrau, Silbergrau, Ton-in-Ton</td>
                  <td>Moderne, monolithische Fläche</td>
                </tr>
                <tr>
                  <td>Anthrazit &amp; schwarze Fliesen</td>
                  <td>Anthrazit, Basalt, Schwarz</td>
                  <td>Elegant und tief; helle Fugen wirken hier schnell unruhig</td>
                </tr>
                <tr>
                  <td>Fliesen in Holzoptik</td>
                  <td>Braunton passend zur dunkelsten Maserung (z. B. Bahama-Beige, Balibraun)</td>
                  <td>Die Fuge „verschwindet" in der Maserung — maximal authentische Holzwirkung</td>
                </tr>
                <tr>
                  <td>Metro- / Riemchenfliesen</td>
                  <td>Bewusster Kontrast (z. B. Grau auf Weiß) oder Ton-in-Ton</td>
                  <td>Kontrast betont das klassische Raster</td>
                </tr>
                <tr>
                  <td>Terrassenplatten außen</td>
                  <td>Steingrau, Basalt — eher dunkler</td>
                  <td>Unempfindlich gegen Witterung und Verschmutzung</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Silbergraue Fugen: der Allrounder</h2>
          <p>Silbergrau ist aus gutem Grund die meistverarbeitete Fugenfarbe: Sie ist hell genug, um Flächen ruhig und großzügig wirken zu lassen, aber unempfindlicher als Reinweiß. Zu weißen Fliesen sind silbergraue Fugen die Empfehlung Nummer eins — die Fläche bleibt hell, die Fuge auch nach Jahren gepflegt. Auch zu hellgrauen Fliesen, Betonoptik und vielen Steinoptiken passt Silbergrau nahezu immer.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Beige Fliesen: Vorsicht mit grauen Fugen</h2>
          <p>Der häufigste Fehler, den wir auf Baustellen korrigieren: graue Fugen zu beigen Fliesen. Grau enthält Blau — neben warmem Beige wirkt die Fuge dadurch schmuddelig statt neutral. Zu beigen und cremefarbenen Fliesen gehören warme Fugentöne: Beige, Sandgrau oder Jasmin, im Zweifel eine Nuance dunkler als die Fliese. So bleibt die Fläche warm und harmonisch.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Praxis-Tipps vom Meisterbetrieb</h2>
          <ul class="list-disc pl-6 space-y-4">
            <li><strong>Muster im Raumlicht prüfen:</strong> Fugenfarbe immer mit der Originalfliese bei Tageslicht <em>und</em> Kunstlicht vergleichen — Farbkarten täuschen.</li>
            <li><strong>Nass ist dunkler:</strong> Frischer Fugenmörtel trocknet deutlich heller auf. Beurteile die Farbe erst nach vollständiger Trocknung.</li>
            <li><strong>Schmale Fugen, ruhige Fläche:</strong> Bei Großformaten reduzieren wir Fugenbreiten auf ein Minimum — die Fugenfarbe wird dadurch noch unauffälliger.</li>
            <li><strong>Silikonfugen abstimmen:</strong> Anschluss- und Eckfugen aus Silikon gibt es in denselben Farbtönen wie den Fugenmörtel — beides sollte aus einer Farbfamilie kommen.</li>
          </ul>
        </section>

        <blockquote class="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Die perfekte Fuge sieht man nicht — man spürt nur, dass die Fläche ruhig ist."
        </blockquote>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Fugenfarbe live vergleichen — in Bocholt</h2>
          <p>In unserem Showroom in Bocholt legen wir deine Wunschfliese neben echte Fugenmuster — kein Raten nach Farbkarte. Und in der <a href="/3d-badplanung-bocholt">fotorealistischen 3D-Planung</a> siehst du vorab, wie Fliese und Fuge im fertigen Raum wirken. Wenn du gerade dein Bad planst: Hier geht's zu unserer <a href="/badsanierung-bocholt">Badsanierung aus einer Hand</a>.</p>
        </section>
      </div>
    `
  },
  {
    id: 'wie-finde-ich-das-passende-fliesenformat',
    title: 'Fliesengrößen im Überblick: Standardmaße, Tabelle und das richtige Format fürs Bad',
    excerpt: 'Von 30×60 bis 160×320 cm: Alle gängigen Fliesengrößen in der Tabelle — und warum im kleinen Bad oft die große Fliese gewinnt.',
    category: 'Fachwissen',
    readTime: '10 Min.',
    date: 'August 2026',
    image: '/images/slider-grossformate/stonetec-grossformat-1.jpg',
    featured: false,
    content: `
      <div class="space-y-12">
        <section>
          <p class="text-xl leading-relaxed mb-8">Welche Fliesengröße passt zu welchem Raum? Kaum eine Entscheidung prägt die Raumwirkung so stark wie das Format — und kaum eine wird so oft nach Gewohnheit statt nach Wirkung getroffen. Die gute Nachricht: Es gibt klare Faustregeln.</p>
          <p>Hier findest du alle gängigen Fliesengrößen in der Übersicht, die Standardmaße für Boden und Wand — und unsere Meister-Empfehlungen, welches Format in Bad, Wohnbereich und Küche wirklich funktioniert.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Fliesenformate-Tabelle: die Standardgrößen</h2>
          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Format (cm)</th>
                  <th>Kategorie</th>
                  <th>Typischer Einsatz</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10×10 bis 20×20</td>
                  <td>Kleinformat / Mosaik</td>
                  <td>Duschböden (Gefälle!), Akzentflächen, Retro-Looks</td>
                </tr>
                <tr>
                  <td>25×40 / 30×60</td>
                  <td>Klassisches Wandformat</td>
                  <td>Badwände — 30×60 ist das heutige Standardmaß</td>
                </tr>
                <tr>
                  <td>60×60</td>
                  <td>Standard-Bodenfliese</td>
                  <td>Bäder, Flure, Küchen — der Allrounder</td>
                </tr>
                <tr>
                  <td>30×120 / 20×120</td>
                  <td>Holzoptik-Diele</td>
                  <td>Wohnbereiche und Bäder in Holzoptik</td>
                </tr>
                <tr>
                  <td>60×120 / 75×150</td>
                  <td>Großformat</td>
                  <td>Ruhige Böden und Wände, moderne Bäder</td>
                </tr>
                <tr>
                  <td>80×80 / 100×100 / 120×120</td>
                  <td>Großformat quadratisch</td>
                  <td>Offene Wohnbereiche, großzügige Flächen</td>
                </tr>
                <tr>
                  <td>bis 160×320</td>
                  <td>XXL-Keramikplatte</td>
                  <td>Nahezu fugenlose Wände, Duschrückwände, Waschtische</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-4">„Die eine Standard-Fliesengröße" gibt es also nicht mehr — der Markt hat sich klar zu größeren Formaten entwickelt: 60×60 cm am Boden und 30×60 cm an der Wand sind heute der gängige Ausgangspunkt, Großformate ab 60×120 cm die moderne Kür.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Fliesengrößen im Bad: groß schlägt klein</h2>
          <p>Der verbreitetste Irrtum: „Kleines Bad, kleine Fliesen." Das Gegenteil stimmt. Je weniger Fugen die Fläche unterbrechen, desto ruhiger und größer wirkt der Raum — gerade auf 5 bis 8 Quadratmetern. Unsere Empfehlung für Bäder:</p>
          <ul class="list-disc pl-6 space-y-4 mt-4">
            <li><strong>Boden:</strong> 60×60 cm oder 60×120 cm. Im Duschbereich kombinieren wir bei Bedarf mit kleineren Formaten oder Mosaik, damit das Gefälle sauber läuft.</li>
            <li><strong>Wand:</strong> 30×60 cm als Standard, 60×120 cm und größer für die moderne, nahezu fugenlose Anmutung.</li>
            <li><strong>Duschrückwand:</strong> XXL-Platten bis 160×320 cm — eine Fläche, keine Fugen, maximale Pflegeleichtigkeit.</li>
            <li><strong>Boden und Wand im selben Format</strong> (durchlaufende Fugen) lassen kleine Bäder am großzügigsten wirken.</li>
          </ul>
        </section>

        <blockquote class="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Nicht der Raum bestimmt die maximale Fliesengröße — sondern das Können des Verarbeiters."
        </blockquote>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Worauf es bei großen Formaten ankommt</h2>
          <p>Mit der Fliesengröße steigen die technischen Anforderungen: Der Untergrund muss absolut eben sein, verlegt wird im Buttering-Floating-Verfahren mit Nivelliersystem, und ab etwa 120 cm Kantenlänge braucht es Vakuumheber und Schneidetische. Deshalb gehören Großformate in Meisterhand — mehr dazu in unserem Beitrag <a href="/magazin/grossformatfliesen-verlegen-in-bocholt">Großformatfliesen verlegen in Bocholt</a> und auf unserer Seite <a href="/grossformatfliesen-verlegen">Großformatfliesen bis 320 cm</a>.</p>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Faustregeln für die Formatwahl</h2>
          <ul class="list-disc pl-6 space-y-4">
            <li><strong>Raumwirkung vor Raumgröße:</strong> Große Formate beruhigen — auch und gerade in kleinen Räumen.</li>
            <li><strong>Fugenbild planen:</strong> Das Format sollte möglichst ohne schmale Reststücke an Wänden und Ecken aufgehen — das prüfen wir im Aufmaß.</li>
            <li><strong>Verlegemuster mitdenken:</strong> Diele im Drittelverband, Quadrat im Kreuzverband — Muster und Format gehören zusammen entschieden.</li>
            <li><strong>Rutschhemmung beachten:</strong> Im Bad zählt neben der Größe die Oberfläche (R-Klassen) — Beratung lohnt sich.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-3xl font-light tracking-tight mb-6">Formate vorab im eigenen Bad sehen</h2>
          <p>Ob 60×60 oder XXL-Platte: In unserer <a href="/3d-badplanung-bocholt">fotorealistischen 3D-Badplanung</a> probierst du Formate, Verlegemuster und Fugenfarben virtuell in deinem Raum aus, bevor die erste Fliese bestellt ist. Und wenn das ganze Bad ansteht: <a href="/badsanierung-bocholt">Badsanierung aus einer Hand in Bocholt</a>.</p>
        </section>
      </div>
    `
  },
]
