import { handler } from '../src/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as payments from '../src/lib/payments';
import * as apigateway from '../src/lib/apigateway';
import * as validation from '../src/lib/validation';
import { randomUUID } from 'crypto';
import { ERROR_MESSAGES } from '../src/lib/constants';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

const paymentId = randomUUID();
(randomUUID as jest.Mock).mockReturnValue(paymentId);

describe('When the user creates a new payment', () => {
    it('Successfully creates a payment with valid input.', async () => {
        const payment = {
            currency: 'AUD',
            amount: 2000,
        };
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce(undefined);
        const parseInputMock = jest.spyOn(apigateway, 'parseInput').mockReturnValue(payment);
        const validatePaymentMock = jest.spyOn(validation, 'validatePayment').mockReturnValue({ isValid: true });

        const result = await handler({
            body: JSON.stringify(payment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toEqual({ result: paymentId });

        expect(parseInputMock).toHaveBeenCalledWith(JSON.stringify(payment));
        expect(validatePaymentMock).toHaveBeenCalledWith(payment);
        expect(createPaymentMock).toHaveBeenCalledWith(expect.objectContaining({ ...payment, paymentId }));
    });

    it('Returns a 422 error when the input is invalid.', async () => {
        const payment = {
            currency: 'AUD',
            amount: 2000,
            random: 'invalid',
        };
        const parseInputMock = jest.spyOn(apigateway, 'parseInput').mockReturnValue(payment);
        const validatePaymentMock = jest.spyOn(validation, 'validatePayment').mockReturnValue({ isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_DETAILS });

        const result = await handler({
            body: JSON.stringify(payment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ error: ERROR_MESSAGES.INVALID_PAYMENT_DETAILS });

        expect(parseInputMock).toHaveBeenCalledWith(JSON.stringify(payment));
        expect(validatePaymentMock).toHaveBeenCalledWith(payment);
    });

    it('Returns a 500 error when an exception occurs.', async () => {
        const payment = {
            currency: 'AUD',
            amount: 2000,
        };
        const parseInputMock = jest.spyOn(apigateway, 'parseInput').mockReturnValue(payment);
        const validatePaymentMock = jest.spyOn(validation, 'validatePayment').mockReturnValue({ isValid: true });
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockRejectedValueOnce(new Error('Internal Server Error'));

        const result = await handler({
            body: JSON.stringify(payment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Internal Server Error' });

        expect(parseInputMock).toHaveBeenCalledWith(JSON.stringify(payment));
        expect(validatePaymentMock).toHaveBeenCalledWith(payment);
        expect(createPaymentMock).toHaveBeenCalledWith(expect.objectContaining({ ...payment, paymentId }));
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
