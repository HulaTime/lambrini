import fp from 'fastify-plugin';
import stringArrToString from '../utils/stringArrToString';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';

import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

const plugin = fp(async function AwsTransformerPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorateRequest('lambdaEvent', null);
  fastify.addHook('onRequest', async function(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { headers, body, method } = req;

    let eventHeaders: APIGatewayProxyEventHeaders = {};
    
    Object.entries(headers).forEach(entry => {
      const [key, value] = entry;
      eventHeaders[key] = Array.isArray(value) ? stringArrToString(value) : value;
    });

    // let eventBody: string | null = null;
    // if (headers['content-type'] === 'application/json') {
    //   eventBody = JSON.stringify(body);
    // }

    req.lambdaEvent = {
      headers: eventHeaders,
      // body: eventBody,
    }
  });
});

export default plugin;
