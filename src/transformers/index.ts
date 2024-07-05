import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import stringArrToString from '../utils/stringArrToString';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';

const AwsTransformerPlugin = (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.decorateRequest('lambdaEvent', null);
  fastify.addHook('onRequest', (req: FastifyRequest, reply: FastifyReply): void => {
    const { headers, body, method } = req;
    let eventHeaders: APIGatewayProxyEventHeaders = {};

    Object.entries(headers).forEach(entry => {
      const [key, value] = entry;
      eventHeaders[key] = Array.isArray(value) ? stringArrToString(value) : value;
    });

    let eventBody: string | null = null;
    if (headers['content-type'] === 'application/json') {
      eventBody = JSON.stringify(body);
    }

    req.lambdaEvent = {
      headers: eventHeaders,
      body: eventBody,
    }
  });
};
