import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { randomUUID } from 'crypto';

const validatePayment = (payment: Payment): boolean => {
    if (typeof payment.amount !== 'number' || payment.amount <= 0) {
        return false;
    }
    if (typeof payment.currency !== 'string' || payment.currency.length !== 3) {
        return false;
    }
    return true;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payment = parseInput(event.body || '{}') as Payment;

    if (!validatePayment(payment)) {
        return buildResponse(422, {
            error: 'Payment data not acceptable.',
        });
    }
    payment.id = randomUUID();
    await createPayment(payment);
    return buildResponse(201, { result: payment.id });
};
