import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

/* ─── Reveal Component ─────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
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
    "description": "Stilvolle Kombination aus Terrazzo und Metrofliesen. Ein Badkonzept mit Charakter und Qualität.",
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
    "description": "Klassisches Fischgrät-Muster in moderner Betonoptik. Ein Bodenbelag, der Tradition und Moderne verbindet.",
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
    "description": "Meisterhafte Verlegung auf 500 Quadratmetern. Naturstein- und Marmoroptik in ihrer edelsten Form.",
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
    "description": "Harmonisches Zusammenspiel von Naturstein und Marmor. Ein Ort der Ruhe und Entspannung.",
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
    "description": "Präzise Handwerkskunst trifft auf edle Optik. Ein Bad, das durch Materialität und Ausführung überzeugt.",
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
    "description": "Reduziertes Design in Marmoroptik. Klarheit und Struktur für ein modernes Badezimmer.",
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
    "description": "Moderne Betonoptik für ein urbanes Lebensgefühl. Robust, pflegeleicht und ästhetisch ansprechend.",
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
    "description": "Repräsentative Gewerbeflächen in Natursteinoptik. Langlebigkeit und Exklusivität für den professionellen Einsatz.",
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
    "description": "Großflächige Verlegung in Naturstein- und Betonoptik. Ein durchgängiges Gestaltungskonzept.",
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
    "description": "Exklusive Hotelgestaltung mit Terrazzooptik und Metrofliesen. Ein Ort der Gastfreundschaft und des Designs.",
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
    "description": "Moderne Kombination aus Beton- und Marmoroptik. Hochwertige Materialien für ein exklusives Bad.",
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
    "description": "Poolgestaltung in Natursteinoptik. Beständigkeit und Ästhetik für den Außenbereich.",
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const allImages = [project.mainImage, ...project.gallery]

  useEffect(() => {
    if (allImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [allImages.length])

  return (
    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 mb-32 lg:mb-48 items-center`}>
      {/* Image Side */}
      <div className="w-full lg:w-1/2">
        <Reveal delay={0.2}>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={allImages[currentImgIndex]}
                src={allImages[currentImgIndex]}
                alt={project.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            
            {/* Image Indicators */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {allImages.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentImgIndex ? 'w-8 bg-inv-light' : 'w-2 bg-inv-light/40'}`}
                  />
                ))}
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060640] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </Reveal>
      </div>

      {/* Content Side */}
      <div className="w-full lg:w-1/2">
        <Reveal delay={0.1}>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            {project.category}
          </p>
          <h2 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-[1.1] tracking-[-0.03em] mb-8">
            {project.title}
          </h2>
          <p className="font-dm text-lg text-warm-text/70 leading-relaxed mb-12 max-w-xl">
            {project.description}
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-8 mb-12 border-t border-warm-mittel/20 pt-8">
            <div>
              <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-2">Fläche</p>
              <p className="font-sora font-light text-warm-text">{project.stats.area}</p>
            </div>
            <div>
              <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-2">Dauer</p>
              <p className="font-sora font-light text-warm-text">{project.stats.duration}</p>
            </div>
            <div className="col-span-2">
              <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-2">Materialien</p>
              <p className="font-sora font-light text-warm-text">{project.stats.materials}</p>
            </div>
          </div>

          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link 
              to="/kontakt" 
              className="inline-flex items-center gap-4 group"
            >
              <span className="font-dm text-sm text-warm-text uppercase tracking-[2px]">Projekt anfragen</span>
              <div className="w-12 h-[1px] bg-warm-text group-hover:w-16 transition-all duration-500" />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Projekte() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title="Projekte — Meisterwerke aus Keramik & Naturstein"
        description="Entdecke unsere Referenzen. Von exklusiven Badezimmern bis zu großflächigen Wohnraumgestaltungen in Bocholt und Umgebung."
      />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-32">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Referenzen
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,7vw,5.5rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl">
            Meisterwerke.<br />In jedem Detail.
          </h1>
        </Reveal>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {projects.map((project, index) => (
          <ProjectSection key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Footer Stats */}
      <div className="bg-dark-bg py-24 mt-24 noise">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Reveal delay={0.1}>
              <p className="font-sora font-extralight text-5xl text-inv-light mb-2">500+</p>
              <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px]">Abgeschlossene Projekte</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sora font-extralight text-5xl text-inv-light mb-2">100%</p>
              <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px]">Zufriedenheitsgarantie</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-sora font-extralight text-5xl text-inv-light mb-2">25+</p>
              <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px]">Jahre Erfahrung</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32 text-center">
        <Reveal>
          <h2 className="font-sora font-extralight text-[clamp(2rem,5vw,3.5rem)] text-warm-text leading-tight tracking-[-0.02em] mb-12">
            Bereit für dein eigenes<br />Meisterwerk?
          </h2>
          <Link 
            to="/kontakt"
            className="inline-block bg-dark-bg text-inv-light font-dm text-[0.7rem] uppercase tracking-[3px] px-12 py-6 rounded-full hover:bg-warm-mittel transition-colors duration-500"
          >
            Projekt anfragen
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
