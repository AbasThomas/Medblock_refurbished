export const formatPatientId = (did?: string | null, raw?: boolean) => {
    if (!did) return 'Medblock:id 000000'

    if (raw) return did

    const parts = did.split(':')
    const uniquePart = parts[parts.length - 1] || ''
    const sanitized = uniquePart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    const padded = (sanitized || '000000').padStart(6, '0').slice(-6)
    const mixed = `${padded.slice(0, 3)}-${padded.slice(3)}`
    return `Medblock:id ${mixed}`
}

export const getRawDid = (did?: string | null) => {
    return did || 'No DID available'
}
