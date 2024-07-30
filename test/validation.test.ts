import { validatePayment, isValidCurrency } from '../src/lib/validation';
import { ERROR_MESSAGES } from '../src/lib/constants';
import { Payment } from '../src/lib/payments';

describe('Validation Tests', () => {
    describe('When validatePayment function is used', () => {
        it('Returns valid for a correct payment object.', () => {
            const payment: Payment = {
                amount: 1000,
                currency: 'AUD',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('Returns an error for an invalid payment object.', () => {
            const payment = {
                amount: 1000,
                invalidKey: 'AUD',
            };

            const result = validatePayment(payment as unknown as Payment);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe(ERROR_MESSAGES.INVALID_PAYMENT_DETAILS);
        });

        it('Returns an error for an invalid amount of negative number.', () => {
            const payment: Payment = {
                amount: -1000,
                currency: 'AUD',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
        });

        it('Returns an error for an invalid amount of zero.', () => {
            const payment: Payment = {
                amount: 0,
                currency: 'AUD',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
        });

        it('Returns an error for an invalid amount of number out of range.', () => {
            const payment: Payment = {
                amount: 12345678901234.99,
                currency: 'AUD',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
        });

        it('Returns an error for an invalid currency.', () => {
            const payment: Payment = {
                amount: 1000,
                currency: 'INVALID',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe(ERROR_MESSAGES.INVALID_CURRENCY);
        });

        it('Converts currency to uppercase for db storage.', () => {
            const payment: Payment = {
                amount: 1000,
                currency: 'aud',
            };

            const result = validatePayment(payment);

            expect(result.isValid).toBe(true);
            expect(payment.currency).toBe('AUD');
        });
    });

    describe('When isValidCurrency function is used', () => {
        it('Returns true for a valid currency.', () => {
            expect(isValidCurrency('AUD')).toBe(true);
        });

        it('Is case insensitive.', () => {
            expect(isValidCurrency('aud')).toBe(true);
        });

        it('Returns false for an invalid currency.', () => {
            expect(isValidCurrency('INVALID')).toBe(false);
        });
    });
});
