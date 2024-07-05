import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.get('/', async (request, reply) => {
    fastify.log.info({ request, reply })
    return { hello: 'world' }
  })
}
