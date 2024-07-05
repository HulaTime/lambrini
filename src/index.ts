import Fastify from 'fastify';
import testRoute from './testRoute';

const fastify = Fastify({ logger: true }); 

fastify.register(testRoute);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error({err}, 'Failed to start fastify server');
    process.exit(1);
  }
}

start();

