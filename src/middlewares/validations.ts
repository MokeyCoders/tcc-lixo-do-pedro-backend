import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { validateSchema } from '../helpers/validations';

export function validateBody(schema: Joi.Schema, config?: object) {
  return async function middleware(request: Request, _: Response, next: NextFunction) {
    try {
      const customConfig = {
        stripUnknown: true,
        ...config,
      };

      const result = await validateSchema(schema, request.body, customConfig);
      request.body = result;

      next();
    } catch (err) {
      next(err);
    }
  };
}

export function validateQuery(schema: Joi.Schema, config?: object) {
  return async function middleware(request: Request, _: Response, next: NextFunction) {
    try {
      const result = await validateSchema(schema, request.query, config);
      request.query = result;

      next();
    } catch (err) {
      next(err);
    }
  };
}

export function validateParams(schema: Joi.Schema, config?: object) {
  return async function middleware(request: Request, _: Response, next: NextFunction) {
    try {
      const result = await validateSchema(schema, request.params, config);
      request.params = result;

      next();
    } catch (err) {
      next(err);
    }
  };
}

export default {};
