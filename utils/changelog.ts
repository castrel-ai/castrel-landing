export interface ChangelogListItem {
    path?: string
    date?: string
    version?: string
    order?: number
    meta?: {
        path?: string
        date?: string
        version?: string
        order?: number
    }
}

function getChangelogIdentity(item: ChangelogListItem, index: number): string {
    return item.path
        || item.meta?.path
        || item.version
        || item.meta?.version
        || `changelog-entry-${index}`
}

export function dedupeAndSortChangelogEntries<T extends ChangelogListItem>(items: T[]): T[] {
    const uniqueItems = new Map<string, T>()

    items.forEach((item, index) => {
        uniqueItems.set(getChangelogIdentity(item, index), item)
    })

    return [...uniqueItems.values()].sort((a, b) => {
        const timestampA = Date.parse(a.date || a.meta?.date || '') || 0
        const timestampB = Date.parse(b.date || b.meta?.date || '') || 0
        if (timestampA !== timestampB) return timestampB - timestampA

        const orderA = a.order || a.meta?.order || 0
        const orderB = b.order || b.meta?.order || 0
        return orderB - orderA
    })
}