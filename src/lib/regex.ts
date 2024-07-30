/**
 * This file contains regular expressions used in the OFX Payments API.
 * Usage: validation of various input formats.
 */
export const REGEX = {
    MAX_AMOUNT: /^\d{1,13}(\.\d{1,2})?$/,
    UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};
