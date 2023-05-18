import { NextFunction, Request, Response } from 'express';

import knex from '~/factories/knex';

async function healthcheck(_: Request, response: Response, next: NextFunction) {
  try {
    await knex.raw('SELECT 1 + 1 as result');
    response.json({ status: 'OK' });

  } catch (err) {
    next(err);
  }
}

export default {
  healthcheck,
};
