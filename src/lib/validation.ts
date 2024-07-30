/**
 * This file provides validation functions for payment amounts and currencies.
 * It exports a validatePayment function that checks if a payment object has a valid amount and currency.
 *
 * Usage: validate payment objects before processing.
 */
import { ERROR_MESSAGES } from './constants';
import { currencies } from './currencies';
import { Payment } from './payments';

const isValidAmount = (amount: unknown): boolean => {
    return typeof amount === 'number' && amount > 0 && /^\d{1,13}(\.\d{1,2})?$/.test(amount.toString());
};

const isValidCurrency = (currency: unknown): boolean => {
    return typeof currency === 'string' && currencies.has(currency.toUpperCase());
};

export const validatePayment = (payment: Payment): { isValid: boolean; error?: string } => {
    if (!isValidAmount(payment.amount)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
    }
    if (!isValidCurrency(payment.currency)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_CURRENCY };
    }
    payment.currency = payment.currency.toUpperCase();
    return { isValid: true };
};
