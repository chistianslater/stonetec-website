import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const script = path.resolve(here, '..', 'tests', 'php', 'lead_journal_test.php')
const adminScript = path.resolve(here, '..', 'tests', 'php', 'admin_config_test.php')
const hasPhp = spawnSync('php', ['-v']).status === 0

// Das Lead-Journal ist PHP (läuft auf dem Hosting). Der Test ruft das PHP-Testskript
// auf und wird übersprungen, wenn lokal kein PHP installiert ist.
describe.skipIf(!hasPhp)('Lead-Journal (PHP)', () => {
  it('besteht alle Prüfungen in tests/php/lead_journal_test.php', () => {
    const run = spawnSync('php', [script], { encoding: 'utf8' })
    expect(run.stderr).toBe('')
    expect(run.stdout).toContain('ALLE TESTS BESTANDEN')
    expect(run.status).toBe(0)
  })

  it('liest den Admin-Hash aus der privaten Konfigurationsdatei (tests/php/admin_config_test.php)', () => {
    const run = spawnSync('php', [adminScript], { encoding: 'utf8' })
    expect(run.stderr).toBe('')
    expect(run.stdout).toContain('ALLE TESTS BESTANDEN')
    expect(run.status).toBe(0)
  })
})
