/**
 * Event editions. Kept free of `sanity` imports so API routes can read
 * CURRENT_SEASON without pulling the Studio schema into their bundle.
 *
 * Newest first — the Studio structure follows this order.
 */
export const SEASONS = ['2027', '2026'] as const

/**
 * The edition new sign-ups are filed under. Bump this once per event and add
 * the new year to SEASONS; nothing else needs changing.
 */
export const CURRENT_SEASON = '2027'
