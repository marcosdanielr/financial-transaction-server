import { it, beforeAll, afterAll, describe, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { beforeEach } from 'node:test';
import { execSync } from 'node:child_process';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 2500,
        type: 'credit',
      })
      .expect(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'new transaction',
      amount: 1500,
      type: 'credit',
    });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransacitonsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(listTransacitonsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transaction',
        amount: 1500,
      }),
    ]);
  });

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'new transaction',
      amount: 4500,
      type: 'credit',
    });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransacitonsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const transactionId = listTransacitonsResponse.body.transactions[0].id;

    const transactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(transactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new transaction',
        amount: 4500,
      })
    );
  });

  it.only('should be able to get the summary', async () => {
    const createDebitTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      amount: 5500,
      type: 'credit',
    });

    const cookies = createDebitTransactionResponse.get('Set-Cookie');

    await request(app.server).post('/transactions').set('Cookie', cookies).send({
      title: 'Debit transaction',
      amount: 4500,
      type: 'debit',
    });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 1000,
    });
  });
});
