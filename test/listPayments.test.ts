import * as payments from '../src/lib/payments';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ERROR_MESSAGES } from '../src/lib/constants';

describe('When the user requests the list of payments', () => {
    it('Returns the list of payments for a valid currency.', async () => {
        const mockPayments = [
            { paymentId: '1', currency: 'AUD', amount: 100 },
            { paymentId: '2', currency: 'AUD', amount: 200 },
        ];
        const listPaymentsMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            queryStringParameters: {
                currency: 'AUD',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ data: mockPayments });

        expect(listPaymentsMock).toHaveBeenCalledWith('AUD');
    });

    it('Returns a 400 error for an invalid currency.', async () => {
        const result = await handler({
            queryStringParameters: {
                currency: 'INVALID',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({
            error: ERROR_MESSAGES.INVALID_CURRENCY,
        });
    });

    it('Returns the list of payments when no currency is provided.', async () => {
        const mockPayments = [
            { paymentId: '1', currency: 'USD', amount: 1000 },
            { paymentId: '2', currency: 'AUD', amount: 2000 },
        ];
        const listPaymentsMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            queryStringParameters: {},
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ data: mockPayments });

        expect(listPaymentsMock).toHaveBeenCalledWith(undefined);
    });

    it('Returns a 500 error when an exception occurs.', async () => {
        const listPaymentsMock = jest.spyOn(payments, 'listPayments').mockRejectedValueOnce(new Error('Internal Server Error'));

        const result = await handler({
            queryStringParameters: {
                currency: 'AUD',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({
            error: 'Internal Server Error',
        });

        expect(listPaymentsMock).toHaveBeenCalledWith('AUD');
    });
});

afterEach(() => {
    jest.resetAllMocks();
});