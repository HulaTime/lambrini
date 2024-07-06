import fastify from "fastify";
import fp from 'fastify-plugin';

const plugin = fp(async function pluginTest(fastify, options) {
  console.log('This registers')
  fastify.addHook('onRequest', function (req, reply) {
    console.log('Woooooooooooooooooh this doesnt')
  })
})

const f = fastify({logger: true})
f.register(plugin);
f.get('/boo', (req, reply) => {
  return 'sfdaf';
})


f.listen({port: 3000})
