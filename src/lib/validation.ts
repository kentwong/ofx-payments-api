import { currencies } from './currencies';
import { Payment } from './payments';

const isValidAmount = (amount: any): boolean => {
    return typeof amount === 'number' && amount > 0 && /^\d+(\.\d{1,2})?$/.test(amount.toString());
};

const isValidCurrency = (currency: any): boolean => {
    return typeof currency === 'string' && currencies.has(currency.toUpperCase());
};

export const validatePayment = (payment: Payment): { isValid: boolean; error?: string } => {
    if (!isValidAmount(payment.amount)) {
        return { isValid: false, error: 'Invalid amount. Please enter a valid amount within the allowable range.' };
    }
    if (!isValidCurrency(payment.currency)) {
        return { isValid: false, error: 'Invalid currency. Please enter a valid OFX-supported currency code.' };
    }
    payment.currency = payment.currency.toUpperCase();
    return { isValid: true };
};
