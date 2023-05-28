import fastify from 'fastify';

const app = fastify();

app.get('/hello', () => {
  return 'Hello, world!';
});

app
  .listen({
    port: 8080,
  })
  .then(() => console.log('HTTP Server Running!'));
