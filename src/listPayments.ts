import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments } from './lib/payments';
import { ERROR_MESSAGES } from './lib/constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const currency = event.queryStringParameters?.currency?.toUpperCase();

        const payments = await listPayments(currency);

        return buildResponse(200, { data: payments });
    } catch (error) {
        return buildResponse(500, {
            error: error instanceof Error ? error.message : ERROR_MESSAGES.LIST_PAYMENTS_FAILED,
        });
    }
};
