export const formatPatientId = (did?: string | null, raw?: boolean) => {
    if (!did) return 'Medblock:----'

    // If raw is requested, return the full DID
    if (raw) return did

    // Extract unique part from DID
    // DID format: did:medblock:patient:<unique_string>
    // We want the last 6 characters of the unique string for the short ID
    // If the DID doesn't match expected format, hash or fallback

    const parts = did.split(':')
    const uniquePart = parts[parts.length - 1]
    const seed = uniquePart.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const suffix = (seed.slice(-6) || 'UNKNOWN').padStart(6, '0')

    return `Medblock:${suffix}`
}

export const getRawDid = (did?: string | null) => {
    return did || 'No DID available'
}
