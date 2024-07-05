import { APIGatewayProxyEvent } from "aws-lambda";

declare module 'fastify' {
  interface FastifyRequest {
    lambdaEvent: APIGatewayProxyEvent;
  }
}
