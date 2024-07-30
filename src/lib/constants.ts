/**
 * This file contains constants used in the OFX Payments API.
 * Usage: error messages for API.
 */
export const ERROR_MESSAGES = {
    INVALID_AMOUNT: 'Invalid amount. Please enter a valid amount with up to 13 digits before the decimal point and up to 2 digits after the decimal point.',
    INVALID_CURRENCY: 'Invalid currency. Please enter a valid OFX-supported currency code.',
    CREATE_PAYMENT_FAILED: 'An error occurred while creating the payment.',
    GET_PAYMENT_FAILED: 'An error occurred while retrieving the payment.',
    LIST_PAYMENTS_FAILED: 'An error occurred while listing the payment(s).',
    NO_PAYMENT_ID: 'No payment ID provided.',
    PAYMENT_NOT_FOUND: 'Payment not found.',
};
