import { app } from './app';
import { env } from './env';

const PORT = env.PORT || 4000;

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`HTTP Server Running on Port ${PORT}`));
