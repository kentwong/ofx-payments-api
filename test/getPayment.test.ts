import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ERROR_MESSAGES } from '../src/lib/constants';

describe('When the user requests the records for a specific payment', () => {
    it('Returns the payment matching their input parameter.', async () => {
        const paymentId = randomUUID();
        const mockPayment = {
            paymentId: paymentId,
            currency: 'AUD',
            amount: 2000,
        };
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockPayment);

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('Returns a 400 error when no payment ID is provided.', async () => {
        const result = await handler({
            pathParameters: {},
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({
            error: ERROR_MESSAGES.NO_PAYMENT_ID,
        });
    });

    it('Returns a 400 error when invalid payment ID is provided.', async () => {
        const result = await handler({
            pathParameters: {
                id: 'invalid',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({
            error: ERROR_MESSAGES.INVALID_PAYMENT_ID,
        });
    });

    it('Returns a 404 error when the payment is not found', async () => {
        const paymentId = randomUUID();
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({
            error: ERROR_MESSAGES.PAYMENT_NOT_FOUND,
        });

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('Returns a 500 error when an exception occurs.', async () => {
        const paymentId = randomUUID();
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockRejectedValueOnce(new Error('Internal Server Error'));

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({
            error: 'Internal Server Error',
        });
        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
