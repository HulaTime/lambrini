import Fastify from 'fastify';
import Lambrini from '../Lambrini';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('Lambrini', () => {
  test('it should exist', () => {
    expect(Lambrini).toBeDefined();
  });

  test('I can instantiate a new instance of lambrini with a port number', () => {
    new Lambrini({ port: 3000 });
  });

  test('I can register a function to an endpoint on a lambrini instance', () => {
    const lambrini = new Lambrini();
    const fooBar = jest.fn();
    lambrini.register('get', '/foo/bar', fooBar);
  });

  test('I can optionally provide my own fastify instance to use with Lambrinie', () => {
    const fastify = Fastify();
    new Lambrini({ serverInstance: fastify });
  });

  test('a registered function should be called when the endpoint is invoked', async () => {
    const fastify = Fastify();
    const lambrini = new Lambrini({ serverInstance: fastify });
    const registeredFn = jest.fn().mockReturnValue({ statusCode: 200, body: JSON.stringify({ foo: 'bar' }) });
    lambrini.register('get', '/foo', registeredFn);
    await fastify.inject({ method: 'get', url: '/foo' });
    expect(registeredFn).toHaveBeenCalled();
  });

  test('A handler function that is registered to an endpoint should have a correctly mapped event passed in', (done) => {
    const fastify = Fastify();
    const lambrini = new Lambrini({ serverInstance: fastify });
    const registeredFn = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
      try {
        expect(event).toEqual({
          headers: {
            host: "localhost:80",
            "user-agent": "lightMyRequest",
          }
        })
        done();
        return { statusCode: 200, body: '' };
      } catch (err) {
        done(err);
        return { statusCode: 500, body: '' };
      }
    }
    lambrini.register('get', '/foo', registeredFn);
    fastify.inject({ method: 'get', url: '/foo' });
  });
});
