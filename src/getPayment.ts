import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { getPayment } from './lib/payments';
import { ERROR_MESSAGES } from './lib/constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentId = event.pathParameters?.id;

    if (!paymentId) {
        return buildResponse(400, {
            error: ERROR_MESSAGES.NO_PAYMENT_ID,
        });
    }

    try {
        const payment = await getPayment(paymentId);
        if (!payment) {
            return buildResponse(404, {
                error: ERROR_MESSAGES.PAYMENT_NOT_FOUND,
            });
        }
        return buildResponse(200, payment);
    } catch (error) {
        return buildResponse(500, {
            error: error instanceof Error ? error.message : ERROR_MESSAGES.GET_PAYMENT_FAILED,
        });
    }
};
