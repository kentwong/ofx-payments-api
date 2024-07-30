import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { validatePayment } from './lib/validation';
import { randomUUID } from 'crypto';
import { ERROR_MESSAGES } from './lib/constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const payment = parseInput(event.body || '{}') as Payment;

        const validation = validatePayment(payment);
        if (!validation.isValid) {
            return buildResponse(422, {
                error: validation.error,
            });
        }
        payment.paymentId = randomUUID();
        await createPayment(payment);
        return buildResponse(201, { result: payment.paymentId });
    } catch (error) {
        return buildResponse(500, {
            error: error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_PAYMENT_FAILED,
        });
    }
};
