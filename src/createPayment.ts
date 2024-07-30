import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { validatePayment } from './lib/validation';
import { randomUUID } from 'crypto';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
};
