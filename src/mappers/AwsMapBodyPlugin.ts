import fp from 'fastify-plugin';

import type { IncomingHttpHeaders } from 'http';
import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

const getHeader = (name: string, headers?: IncomingHttpHeaders): string | string[] | undefined => {
  return headers?.[name] ?? headers?.[name.toLowerCase()];
}

const plugin = fp(async function AwsMapBodyPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', async function(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { headers, body } = req;
    if (body && getHeader('Content-Type', headers) === 'application/json') {
      req.lambdaEvent.body = JSON.stringify(body);
    }
  });
});

export default plugin;
