#!/usr/bin/env node
// Erzeugt das initiale lookbook.json aus den Bestandsdaten im Code.
//
// Einmalig vor dem ersten Deploy des Admins auszuführen. Das Ergebnis wird per
// FTP nach /uploads/lookbook.json auf den Server gelegt. Die Bilddateien bleiben
// liegen, wo sie sind — es wandern nur ihre Einträge ins Manifest.
//
// Aufruf: npm run lookbook:manifest [zielverzeichnis]
// Ohne Argument landet die Datei in build-output/uploads/lookbook.json.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fallbackSections } from '../src/lib/lookbookData.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(here, '..', 'build-output', 'uploads')

const sections = Object.fromEntries(
  fallbackSections().map((section) => [section.id, section.images]),
)

const manifest = { version: 1, sections }
const targetFile = path.join(targetDir, 'lookbook.json')

await mkdir(targetDir, { recursive: true })
await writeFile(targetFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const total = Object.values(sections).reduce((sum, list) => sum + list.length, 0)
console.log(`lookbook.json geschrieben: ${targetFile}`)
console.log(`${Object.keys(sections).length} Kategorien, ${total} Bilder`)
