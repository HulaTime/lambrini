import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

type LambriniConfig = {
  serverInstance?: FastifyInstance;
  port?: number;
};

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type ProxyLambdaHandler = (event: Partial<APIGatewayProxyEvent>) => Promise<APIGatewayProxyResult>

export default class Lambrini {
  private serverInstance: FastifyInstance;

  private readonly port: number;

  constructor(config?: LambriniConfig) {
    this.serverInstance = config?.serverInstance ?? Fastify({ logger: true });
    this.port = config?.port ?? 3000;
  }

  register(method: HttpMethod, endpoint: string, handler: ProxyLambdaHandler) {
    const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
      fastify[method](endpoint, async function(req, reply) {
        const result = await handler(req.lambdaEvent);
        reply.code(result.statusCode);
        if (result.headers) {
          Object.entries(result.headers).forEach(([key, value]) => reply.header(key, value));
        }
        reply.send(result.body);
      })
    }
    this.serverInstance.register(plugin);
  }

  async start() {
    try {
      await this.serverInstance.listen({ port: this.port });
    } catch (err) {
      this.serverInstance.log.error({ err }, 'Failed to start fastify server');
      process.exit(1);
    }

  }
}
