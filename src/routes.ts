import express from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

import authorizationMiddleware from './middlewares/authorizations';

const domainsBaseDirectory = resolve(__dirname, 'domains');

function getFileAbsolutePath(subdirectory: string) {
  return join(domainsBaseDirectory, subdirectory, 'routes');
}

function existsModule(absolutePath: string) {
  return existsSync(`${absolutePath}.js`) || existsSync(`${absolutePath}.ts`);
}

const api = express.Router();
const router = express.Router();

function requireModule(absolutePath: string): App.Route {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(absolutePath).default || require(absolutePath);
}

const routes: App.Route[] = readdirSync(domainsBaseDirectory)
  .map(getFileAbsolutePath)
  .filter(existsModule)
  .flatMap(requireModule);

routes.forEach(route => {
  const { method, path, handlers } = route;
  let middlewares: RequestHandlerParams[];

  if (route.public) {
    middlewares = handlers;
  } else {
    middlewares = [authorizationMiddleware, handlers];
  }

  if (route.internal) {
    router[method](path, ...middlewares);
  } else {
    api[method](path, ...middlewares);
  }
});

router.use('/api', api);

export default router;
