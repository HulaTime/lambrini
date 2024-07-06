import Fastify, { FastifyInstance } from 'fastify';
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

  describe('Mapping the request to a proxy event', () => {
    let fastify: FastifyInstance;
    let lambrini: Lambrini;

    beforeEach(() => {
      fastify = Fastify();
      lambrini = new Lambrini({ serverInstance: fastify });
    });

    test('Any headers supplied in the request should be mapped into the proxy event', (done) => {
      const testHeaders = {
        'authorization': 'Bearer daskfjalsjk',
        tango: 'fandango',
      }
      const fakeHandler = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
        try {
          expect(event.headers).toMatchObject(testHeaders);
          done();
          return { statusCode: 200, body: '' };
        } catch (err) {
          done(err);
          return { statusCode: 500, body: '' };
        }
      }
      lambrini.register('get', '/foo', fakeHandler);
      fastify.inject({ method: 'get', url: '/foo', headers: testHeaders });
    });

    test('The original http method should be mapped through', (done) => {
      const fakeHandler = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
        try {
          expect(event.httpMethod?.toLowerCase()).toEqual('get');
          done();
          return { statusCode: 200, body: '' };
        } catch (err) {
          done(err);
          return { statusCode: 500, body: '' };
        }
      }
      lambrini.register('get', '/foo', fakeHandler);
      fastify.inject({ method: 'get', url: '/foo' });
    });

    test('A JSON body should be correctly mapped through', (done) => {
      const testBody = { foo: 'bar', hello: { deep: 'world' } };
      const fakeHandler = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
        try {
          expect(event.body).toEqual(JSON.stringify(testBody));
          done();
          return { statusCode: 200, body: '' };
        } catch (err) {
          done(err);
          return { statusCode: 500, body: '' };
        }
      }
      lambrini.register('post', '/foo', fakeHandler);
      fastify.inject({ method: 'post', url: '/foo', payload: testBody });
    });
  });
});
