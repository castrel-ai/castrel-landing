import { describe, expect, it } from 'vitest'
import { dedupeAndSortChangelogEntries } from '../utils/changelog'

describe('dedupeAndSortChangelogEntries', () => {
    it('removes stale Nuxt Content rows with the same public path', () => {
        const entries = dedupeAndSortChangelogEntries([
            { path: '/zh/changelog/v1-24-0', version: 'v1.24.0', date: '2026-08-21', order: 26 },
            { path: '/zh/changelog/v1-24-0', version: 'v1.24.0', date: '2026-08-21', order: 26 },
            { path: '/zh/changelog/v1-25-0', version: 'v1.25.0', date: '2026-08-31', order: 27 },
        ])

        expect(entries).toHaveLength(2)
        expect(entries.map(entry => entry.version)).toEqual(['v1.25.0', 'v1.24.0'])
    })

    it('uses the version as a fallback identity and preserves date ordering', () => {
        const entries = dedupeAndSortChangelogEntries([
            { version: 'v1.23.0', date: '2026-08-13', order: 25 },
            { version: 'v1.22.0', date: '2026-08-06', order: 24 },
            { version: 'v1.23.0', date: '2026-08-13', order: 25 },
        ])

        expect(entries.map(entry => entry.version)).toEqual(['v1.23.0', 'v1.22.0'])
    })
})