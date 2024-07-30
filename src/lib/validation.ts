/**
 * This file provides validation functions for payment amounts and currencies.
 * It exports a functions that checks if a payment object has a valid amount and currency.
 *
 * Usage: validate payment objects before processing.
 */
import { ERROR_MESSAGES } from './constants';
import { currencies } from './currencies';
import { Payment } from './payments';
import { REGEX } from './regex';

const isValidPaymentObject = (payment: unknown): boolean => {
    if (typeof payment !== 'object' || payment === null) {
        return false;
    }

    const validKeys = ['amount', 'currency'];
    const keys = Object.keys(payment);
    return keys.every((key) => validKeys.includes(key));
};

const isValidAmount = (amount: unknown): boolean => {
    return typeof amount === 'number' && amount > 0 && REGEX.MAX_AMOUNT.test(amount.toString());
};

export const isValidCurrency = (currency: unknown): boolean => {
    return typeof currency === 'string' && currencies.has(currency.toUpperCase());
};

export const validatePayment = (payment: Payment): { isValid: boolean; error?: string } => {
    if (!isValidPaymentObject(payment)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_DETAILS };
    }
    if (!isValidAmount(payment.amount)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
    }
    if (!isValidCurrency(payment.currency)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_CURRENCY };
    }
    payment.currency = payment.currency.toUpperCase();
    return { isValid: true };
};

export const isValidPaymentId = (paymentId: unknown): { isValid: boolean; error?: string } => {
    if (typeof paymentId !== 'string' || !paymentId) {
        return { isValid: false, error: ERROR_MESSAGES.NO_PAYMENT_ID };
    }
    if (!REGEX.UUID_V4.test(paymentId)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_ID };
    }
    return { isValid: true };
};
