import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { env } from './env';

import { transactionRoutes } from './routes/transactions';

const app = fastify();

const PORT = env.PORT || 4000;

app.register(cookie);

app.register(transactionRoutes, {
  prefix: 'transactions',
});

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`HTTP Server Running on Port ${PORT}`));
