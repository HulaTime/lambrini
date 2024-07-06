import fp from 'fastify-plugin';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import stringArrToString from '../utils/stringArrToString';

import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

const plugin = fp(async function AwsMapHeadersPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorateRequest('lambdaEvent', null);
  fastify.addHook('onRequest', async function(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { headers, method } = req;
    let eventHeaders: APIGatewayProxyEventHeaders = {};
    
    Object.entries(headers).forEach(entry => {
      const [key, value] = entry;
      eventHeaders[key] = Array.isArray(value) ? stringArrToString(value) : value;
    });
    req.lambdaEvent = {
      headers: eventHeaders,
      httpMethod: method,
    }
  });
});

export default plugin;
