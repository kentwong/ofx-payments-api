import { validatePayment, isValidCurrency, isValidPaymentId } from '../../src/lib/validation';
import { ERROR_MESSAGES } from '../../src/lib/constants';
import { Payment } from '../../src/lib/payments';

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

    describe('When isValidPaymentId function is used', () => {  
        it('Returns false and NO_PAYMENT_ID error if paymentId is an empty string', () => {
            const result = isValidPaymentId('');
            expect(result).toEqual({ isValid: false, error: ERROR_MESSAGES.NO_PAYMENT_ID });
        });
    
        it('Returns false and INVALID_PAYMENT_ID error if paymentId is not a valid UUID v4', () => {
            const result = isValidPaymentId('invalid-uuid');
            expect(result).toEqual({ isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_ID });
        });
    
        it('Returns true if paymentId is a valid UUID v4', () => {
            const validUUID = '09c244ba-e6a4-4677-bf4f-c5b99e8567ad';
            const result = isValidPaymentId(validUUID);
            expect(result).toEqual({ isValid: true });
        });
    });
});
