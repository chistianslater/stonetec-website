import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'

/* ─── Reveal Component ───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Project Data ───────────────────────────────────────────── */
const projects = [
  {
    "id": "albrecht",
    "title": "Albrecht",
    "category": "Badezimmer | Wohnraum",
    "location": "Bocholt",
    "year": "2024",
    "description": "Zeitlose Eleganz durch die Kombination von Marmor- und Betonoptik. Ein harmonisches Gesamtkonzept für modernes Wohnen.",
    "mainImage": "/images/projekte/Albrecht/stonetec-projekt-albrecht-1.jpg",
    "gallery": [
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-2.jpg",
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-3.jpg",
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-4.jpg",
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-5.jpg",
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-6.jpg",
      "/images/projekte/Albrecht/stonetec-projekt-albrecht-7.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "5 Wochen",
      "materials": "Feinsteinzeug · Marmoroptik · Betonoptik"
    }
  },
  {
    "id": "derksen",
    "title": "Derksen",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Natürlichkeit im Fokus. Hochwertige Natursteinoptik schafft eine warme und einladende Atmosphäre im Badbereich.",
    "mainImage": "/images/projekte/Derksen/stonetec-projekt-derksen-1.jpg",
    "gallery": [
      "/images/projekte/Derksen/stonetec-projekt-derksen-2.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-3.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-4.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-5.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-6.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-7.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-8.jpg",
      "/images/projekte/Derksen/stonetec-projekt-derksen-9.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik"
    }
  },
  {
    "id": "esterabadeyan",
    "title": "Esterabadeyan",
    "category": "Wellness | Spa",
    "location": "Bocholt",
    "year": "2024",
    "description": "Ein großzügiges Wellness-Projekt mit exklusivem Glasmosaik. Luxus und Entspannung auf höchstem handwerklichem Niveau.",
    "mainImage": "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-1.jpg",
    "gallery": [
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-2.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-3.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-4.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-5.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-6.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-7.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-8.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-9.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-10.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-11.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-12.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-13.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-14.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-15.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-16.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-17.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-18.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-19.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-20.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-21.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-22.jpg",
      "/images/projekte/Esterabadeyan/stonetec-projekt-esterabadeyan-23.jpg"
    ],
    "stats": {
      "area": "300 m²",
      "duration": "4 Monate",
      "materials": "Feinsteinzeug · Glasmosaik"
    }
  },
  {
    "id": "goerz",
    "title": "Görz",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Die perfekte Symbiose aus Naturstein- und Marmoroptik. Ein Statement für hochwertiges Baddesign.",
    "mainImage": "/images/projekte/Görz/stonetec-projekt-görz-1.jpg",
    "gallery": [
      "/images/projekte/Görz/stonetec-projekt-görz-2.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-3.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-4.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-5.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-6.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-7.jpg",
      "/images/projekte/Görz/stonetec-projekt-görz-8.jpg"
    ],
    "stats": {
      "area": "50 m²",
      "duration": "6 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "han",
    "title": "Han",
    "category": "Großprojekt Wohnen",
    "location": "Bocholt",
    "year": "2024",
    "description": "Großformatige Keramik auf 300 Quadratmetern. Ein monolithisches Raumerlebnis durch präzise Fugenführung.",
    "mainImage": "/images/projekte/Han/stonetec-projekt-han-1.jpg",
    "gallery": [
      "/images/projekte/Han/stonetec-projekt-han-2.jpg",
      "/images/projekte/Han/stonetec-projekt-han-3.jpg",
      "/images/projekte/Han/stonetec-projekt-han-4.jpg",
      "/images/projekte/Han/stonetec-projekt-han-5.jpg",
      "/images/projekte/Han/stonetec-projekt-han-6.jpg",
      "/images/projekte/Han/stonetec-projekt-han-7.jpg",
      "/images/projekte/Han/stonetec-projekt-han-8.jpg",
      "/images/projekte/Han/stonetec-projekt-han-9.jpg",
      "/images/projekte/Han/stonetec-projekt-han-10.jpg",
      "/images/projekte/Han/stonetec-projekt-han-11.jpg",
      "/images/projekte/Han/stonetec-projekt-han-12.jpg",
      "/images/projekte/Han/stonetec-projekt-han-13.jpg",
      "/images/projekte/Han/stonetec-projekt-han-14.jpg"
    ],
    "stats": {
      "area": "300 m²",
      "duration": "3 Monate",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "heis-bruns",
    "title": "Heis Bruns",
    "category": "Individuelles Wohnen",
    "location": "Bocholt",
    "year": "2024",
    "description": "Kreative Wandgestaltung mit Metrofliesen und Dekor-Elementen. Einzigartiger Charakter durch Liebe zum Detail.",
    "mainImage": "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-1.jpg",
    "gallery": [
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-2.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-3.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-4.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-5.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-6.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-7.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-8.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-9.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-10.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-11.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-12.jpg",
      "/images/projekte/Heis_Bruns/stonetec-projekt-heis_bruns-13.jpg"
    ],
    "stats": {
      "area": "60 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Marmoroptik · Metrofliesen · Dekor-Fliesen"
    }
  },
  {
    "id": "kempkes-storm",
    "title": "Kempkes & Storm",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Moderner Retro-Look durch Terrazzooptik and Metrofliesen. Handwerkliche Präzision trifft auf zeitloses Design.",
    "mainImage": "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-1.jpg",
    "gallery": [
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-2.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-3.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-4.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-5.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-6.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-7.jpg",
      "/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-8.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "3 Wochen",
      "materials": "Feinsteinzeug · Terrazzooptik · Metrofliesen"
    }
  },
  {
    "id": "klump",
    "title": "Klump",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Stilvolle Kombination aus Terrazzo und Metrofliesen. Ein Badkonzept mit Charakter and Qualität.",
    "mainImage": "/images/projekte/Klump/stonetec-projekt-klump-1.jpg",
    "gallery": [
      "/images/projekte/Klump/stonetec-projekt-klump-2.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-3.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-4.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-5.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-6.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-7.jpg",
      "/images/projekte/Klump/stonetec-projekt-klump-8.jpg"
    ],
    "stats": {
      "area": "50 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Terrazzooptik · Metrofliesen"
    }
  },
  {
    "id": "lamers",
    "title": "Lamers",
    "category": "Wohnraum",
    "location": "Bocholt",
    "year": "2024",
    "description": "Klassisches Fischgrät-Muster in moderner Betonoptik. Ein Bodenbelag, der Tradition and Moderne verbindet.",
    "mainImage": "/images/projekte/Lamers/stonetec-projekt-lamers-1.jpg",
    "gallery": [
      "/images/projekte/Lamers/stonetec-projekt-lamers-2.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-3.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-4.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-5.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-6.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-7.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-8.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-9.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-10.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-11.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-12.jpg",
      "/images/projekte/Lamers/stonetec-projekt-lamers-13.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "5 Wochen",
      "materials": "Feinsteinzeug · Betonoptik · Fischgrät"
    }
  },
  {
    "id": "krasemann",
    "title": "Krasemann",
    "category": "Exklusives Wohnen",
    "location": "Bocholt",
    "year": "2024",
    "description": "Meisterhafte Verlegung auf 500 Quadratmetern. Naturstein- and Marmoroptik in ihrer edelsten Form.",
    "mainImage": "/images/projekte/Krasemann/stonetec-projekt-krasemann-1.jpg",
    "gallery": [
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-2.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-3.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-4.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-5.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-6.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-7.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-8.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-9.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-10.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-11.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-12.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-13.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-14.jpg",
      "/images/projekte/Krasemann/stonetec-projekt-krasemann-15.jpg"
    ],
    "stats": {
      "area": "500 m²",
      "duration": "5 Monate",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "moritz",
    "title": "Moritz",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Harmonisches Zusammenspiel von Naturstein and Marmor. Ein Ort der Ruhe and Entspannung.",
    "mainImage": "/images/projekte/Moritz/stonetec-projekt-moritz-1.jpg",
    "gallery": [
      "/images/projekte/Moritz/stonetec-projekt-moritz-2.jpg",
      "/images/projekte/Moritz/stonetec-projekt-moritz-3.jpg",
      "/images/projekte/Moritz/stonetec-projekt-moritz-4.jpg",
      "/images/projekte/Moritz/stonetec-projekt-moritz-5.jpg",
      "/images/projekte/Moritz/stonetec-projekt-moritz-6.jpg",
      "/images/projekte/Moritz/stonetec-projekt-moritz-7.jpg"
    ],
    "stats": {
      "area": "50 m²",
      "duration": "5 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "mpalaskas",
    "title": "Mpalaskas",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Präzise Handwerkskunst trifft auf edle Optik. Ein Bad, das durch Materialität and Ausführung überzeugt.",
    "mainImage": "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-1.jpg",
    "gallery": [
      "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-2.jpg",
      "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-3.jpg",
      "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-4.jpg",
      "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-5.jpg",
      "/images/projekte/Mpalaskas/stonetec-projekt-mpalaskas-6.jpg"
    ],
    "stats": {
      "area": "50 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "onori",
    "title": "Onori",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Reduziertes Design in Marmoroptik. Klarheit and Struktur für ein modernes Badezimmer.",
    "mainImage": "/images/projekte/Onori/stonetec-projekt-onori-1.jpg",
    "gallery": [
      "/images/projekte/Onori/stonetec-projekt-onori-2.jpg",
      "/images/projekte/Onori/stonetec-projekt-onori-3.jpg",
      "/images/projekte/Onori/stonetec-projekt-onori-4.jpg",
      "/images/projekte/Onori/stonetec-projekt-onori-5.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Marmoroptik"
    }
  },
  {
    "id": "pehr",
    "title": "Pehr",
    "category": "Wohnraum",
    "location": "Bocholt",
    "year": "2024",
    "description": "Moderne Betonoptik für ein urbanes Lebensgefühl. Robust, pflegeleicht and ästhetisch ansprechend.",
    "mainImage": "/images/projekte/Pehr/stonetec-projekt-pehr-1.jpg",
    "gallery": [
      "/images/projekte/Pehr/stonetec-projekt-pehr-2.jpg",
      "/images/projekte/Pehr/stonetec-projekt-pehr-3.jpg",
      "/images/projekte/Pehr/stonetec-projekt-pehr-4.jpg",
      "/images/projekte/Pehr/stonetec-projekt-pehr-5.jpg",
      "/images/projekte/Pehr/stonetec-projekt-pehr-6.jpg"
    ],
    "stats": {
      "area": "60 m²",
      "duration": "6 Wochen",
      "materials": "Feinsteinzeug · Betonoptik"
    }
  },
  {
    "id": "praemium",
    "title": "Praemium",
    "category": "Gewerbe",
    "location": "Bocholt",
    "year": "2024",
    "description": "Repräsentative Gewerbeflächen in Natursteinoptik. Langlebigkeit and Exklusivität für den professionellen Einsatz.",
    "mainImage": "/images/projekte/Praemium/stonetec-projekt-praemium-1.jpg",
    "gallery": [
      "/images/projekte/Praemium/stonetec-projekt-praemium-2.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-3.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-4.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-5.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-6.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-7.jpg",
      "/images/projekte/Praemium/stonetec-projekt-praemium-8.jpg"
    ],
    "stats": {
      "area": "150 m²",
      "duration": "2 Monate",
      "materials": "Feinsteinzeug · Natursteinoptik"
    }
  },
  {
    "id": "schwiening",
    "title": "Schwiening",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Individuelle Badgestaltung mit hochwertigen Keramik-Oberflächen. Ein Unikat aus Meisterhand.",
    "mainImage": "/images/projekte/Schwiening/stonetec-projekt-schwiening-1.jpg",
    "gallery": [
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-2.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-3.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-4.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-5.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-6.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-7.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-8.jpg",
      "/images/projekte/Schwiening/stonetec-projekt-schwiening-9.jpg"
    ],
    "stats": {
      "area": "70 m²",
      "duration": "6 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik · Marmoroptik"
    }
  },
  {
    "id": "spoeler",
    "title": "Spöler",
    "category": "Wohnraum | Bad",
    "location": "Bocholt",
    "year": "2024",
    "description": "Großflächige Verlegung in Naturstein- and Betonoptik. Ein durchgängiges Gestaltungskonzept.",
    "mainImage": "/images/projekte/Spöler/stonetec-projekt-spöler-1.jpg",
    "gallery": [
      "/images/projekte/Spöler/stonetec-projekt-spöler-2.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-3.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-4.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-5.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-6.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-7.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-8.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-9.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-10.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-11.jpg",
      "/images/projekte/Spöler/stonetec-projekt-spöler-12.jpg"
    ],
    "stats": {
      "area": "150 m²",
      "duration": "10 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik · Betonoptik"
    }
  },
  {
    "id": "van-gessel",
    "title": "Van Gessel",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Kompaktes Design mit großer Wirkung. Natursteinoptik für ein zeitloses Badezimmer.",
    "mainImage": "/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-1.jpg",
    "gallery": [
      "/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-2.jpg",
      "/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-3.jpg",
      "/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-4.jpg",
      "/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-5.jpg"
    ],
    "stats": {
      "area": "30 m²",
      "duration": "3 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik"
    }
  },
  {
    "id": "landhotel-voshoevel",
    "title": "Landhotel Voshövel",
    "category": "Gewerbe | Hotel",
    "location": "Schermbeck",
    "year": "2024",
    "description": "Exklusive Hotelgestaltung mit Terrazzooptik and Metrofliesen. Ein Ort der Gastfreundschaft and des Designs.",
    "mainImage": "/images/projekte/Voshövel/stonetec-projekt-voshövel-1.jpg",
    "gallery": [
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-2.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-3.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-4.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-5.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-6.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-7.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-8.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-9.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-10.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-11.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-12.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-13.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-14.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-15.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-16.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-17.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-18.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-19.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-20.jpg",
      "/images/projekte/Voshövel/stonetec-projekt-voshövel-21.jpg"
    ],
    "stats": {
      "area": "200 m²",
      "duration": "2 Monate",
      "materials": "Feinsteinzeug · Terrazzooptik · Metrofliesen"
    }
  },
  {
    "id": "weidemann",
    "title": "Weidemann",
    "category": "Badezimmer",
    "location": "Bocholt",
    "year": "2024",
    "description": "Moderne Kombination aus Beton- and Marmoroptik. Hochwertige Materialien für ein exklusives Bad.",
    "mainImage": "/images/projekte/Weidemann/stonetec-projekt-weidemann-1.jpg",
    "gallery": [
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-2.jpg",
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-3.jpg",
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-4.jpg",
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-5.jpg",
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-6.jpg",
      "/images/projekte/Weidemann/stonetec-projekt-weidemann-7.jpg"
    ],
    "stats": {
      "area": "40 m²",
      "duration": "4 Wochen",
      "materials": "Feinsteinzeug · Betonoptik · Marmoroptik"
    }
  },
  {
    "id": "weidemann-pool",
    "title": "Weidemann Pool",
    "category": "Pool | Wellness",
    "location": "Bocholt",
    "year": "2024",
    "description": "Poolgestaltung in Natursteinoptik. Beständigkeit and Ästhetik für den Außenbereich.",
    "mainImage": "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-1.jpg",
    "gallery": [
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-2.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-3.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-4.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-5.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-6.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-7.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-8.jpg",
      "/images/projekte/Weidemann_Pool/stonetec-projekt-weidemann_pool-9.jpg"
    ],
    "stats": {
      "area": "30 m²",
      "duration": "3 Wochen",
      "materials": "Feinsteinzeug · Natursteinoptik"
    }
  }
]

/* ─── Project Section Component ──────────────────────────────── */
function ProjectSection({ project, index }) {
  const containerRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [project.mainImage, ...(project.gallery || [])]
  
  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [images.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0])
  const isEven = index % 2 === 0

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden"
    >
      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center"
      >
        {/* Text Content */}
        <div className={`lg:col-span-5 z-10 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <Reveal delay={0.1}>
            <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
              {project.category}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4.5rem)] text-warm-text leading-[1.1] tracking-[-0.03em] mb-8">
              {project.title}
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-dm text-[1.1rem] text-warm-mittel leading-relaxed mb-10 max-w-md">
              {project.description}
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-warm-anthrazit/10 mb-10">
              <div>
                <p className="font-dm text-[0.7rem] text-warm-mittel uppercase tracking-widest mb-1">Ort</p>
                <p className="font-sora font-light text-lg text-warm-text">{project.location}</p>
              </div>
              <div>
                <p className="font-dm text-[0.7rem] text-warm-mittel uppercase tracking-widest mb-1">Jahr</p>
                <p className="font-sora font-light text-lg text-warm-text">{project.year}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <Link 
              to="/kontakt" 
              className="group inline-flex items-center gap-4 px-8 py-4 bg-dark-bg text-inv-light font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-black transition-all duration-500 rounded-none"
            >
              <span>Projekt anfragen</span>
              <motion.span 
                className="w-8 h-[1px] bg-inv-light/50"
                whileHover={{ width: 48 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </Reveal>
        </div>

        {/* Image Display */}
        <div className={`lg:col-span-7 relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.div 
            style={{ y }}
            className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-dark-bg"
          >
            <AnimatePresence initial={false}>
              <motion.img 
                key={currentImageIndex}
                src={images[currentImageIndex]} 
                alt={project.title} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060630] to-transparent pointer-events-none" />
            
            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Decorative Stats Card */}
          <motion.div 
            initial={{ x: isEven ? 40 : -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`absolute bottom-10 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl hidden md:block max-w-[280px] z-30 ${isEven ? '-left-16' : '-right-16'}`}
          >
            <div className="space-y-6">
              <div>
                <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Material</p>
                <p className="font-sora font-light text-sm text-warm-text leading-tight">{project.stats.materials}</p>
              </div>
              <div className="flex justify-between gap-8">
                <div>
                  <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Fläche</p>
                  <p className="font-sora font-light text-sm text-warm-text">{project.stats.area}</p>
                </div>
                <div>
                  <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Dauer</p>
                  <p className="font-sora font-light text-sm text-warm-text">{project.stats.duration}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Projekte() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48">
      <SEO 
        title="Projekte — Referenzen & Inspiration"
        description="Entdecke unsere abgeschlossenen Projekte in Bocholt und Umgebung. Von luxuriösen Badezimmern bis hin zu repräsentativen Gewerbeobjekten."
      />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-24">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Portfolio
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,8vw,6rem)] text-warm-text leading-[0.95] tracking-[-0.04em] max-w-4xl mb-8">
            Das Beste an unserer Arbeit sieht man nicht.
          </h1>
          <div className="w-24 h-[1px] bg-warm-stein/30 mb-8" />
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Jedes Projekt ist eine Geschichte — von der ersten Idee bis zur letzten Fuge. 
            Wir gestalten Räume, die bleiben. Mit Leidenschaft fürs Detail und einem Blick fürs Ganze.
          </p>
        </Reveal>
      </div>

      {/* Projects List */}
      <div className="space-y-0">
        {projects.map((project, index) => (
          <ProjectSection key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32">
        <Reveal>
          <div className="bg-dark-bg rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warm-stein/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-stein/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-sora font-extralight text-3xl md:text-5xl text-inv-light mb-16 tracking-tight">
                Meisterschaft in Zahlen.
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">500+</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Projekte</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">7</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Meister</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">180+</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Jahre Erfahrung</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">0</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Subunternehmer</p>
                </div>
              </div>
              
              <div className="mt-20">
                <Link 
                  to="/kontakt" 
                  className="inline-flex items-center gap-4 px-10 py-5 bg-warm-bg text-warm-text font-dm text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none"
                >
                  Dein Projekt starten
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
