import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { currencies } from './lib/currencies';
import { randomUUID } from 'crypto';

const validatePayment = (payment: Payment): boolean => {
    if (typeof payment.amount !== 'number' || payment.amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(payment.amount.toString())) {
        return false;
    }
    if (typeof payment.currency !== 'string') {
        return false;
    }
    payment.currency = payment.currency.toUpperCase();
    if (!currencies.has(payment.currency)) {
        return false;
    }
    return true;
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payment = parseInput(event.body || '{}') as Payment;

    if (!validatePayment(payment)) {
        return buildResponse(422, {
            error: 'Payment data not acceptable.',
        });
    }
    payment.paymentId = randomUUID();
    await createPayment(payment);
    return buildResponse(201, { result: payment.paymentId });
};
