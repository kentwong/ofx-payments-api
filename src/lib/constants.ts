/**
 * This file contains constants used in the OFX Payments API.
 * Usage: error messages for API.
 */
export const ERROR_MESSAGES = {
    INVALID_AMOUNT: 'Invalid amount. Please enter a valid amount with up to 13 digits before the decimal point and up to 2 digits after the decimal point.',
    INVALID_CURRENCY: 'Invalid currency. Please enter a valid OFX-supported currency code.',
    INVALID_PAYMENT_DETAILS: 'Invalid payment details. Please provide a valid JSON with only "amount" and "currency" keys in lowercase.',
    CREATE_PAYMENT_FAILED: 'An error occurred while creating the payment. Please try again later.',
    GET_PAYMENT_FAILED: 'An error occurred while retrieving the payment. Please try again later.',
    LIST_PAYMENTS_FAILED: 'An error occurred while listing the payments. Please try again later.',
    NO_PAYMENT_ID: 'No payment ID provided. Please provide a valid payment ID.',
    INVALID_PAYMENT_ID: 'Invalid payment ID. Please provide a valid payment ID.',
    PAYMENT_NOT_FOUND: 'Payment not found.',
};
