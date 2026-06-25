/**
 * Formats a Date object into a human-readable short string.
 * Example: "15 gen 2025"
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
