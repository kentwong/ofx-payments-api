import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse } from "./lib/apigateway";
import { getPayment, Payment } from "./lib/payments";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentId = event.pathParameters?.id;

    if (!paymentId) {
        return buildResponse(400, {
            error: 'No payment ID provided.', 
        });
    }
    
    try {
        const payment = await getPayment(paymentId);
        return buildResponse(200, payment as Payment);
    } catch (error) {
        return buildResponse(500, {
            error: 'An error occurred while retrieving the payment.',
        });
    }
};
