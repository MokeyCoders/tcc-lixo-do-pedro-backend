import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const domainsBaseDirectory = resolve(__dirname, '..', 'domains');

function getFileAbsolutePath(subdirectory: string) {
  return join(domainsBaseDirectory, subdirectory, 'errors');
}

function existsModule(absolutePath: string) {
  return existsSync(`${absolutePath}.js`) || existsSync(`${absolutePath}.ts`);
}

function requireModule(absolutePath: string) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(absolutePath).default || require(absolutePath);
}

const othersErrorCodes = {
  10: 'The requested route was not found.',
  11: 'The requested resource was not found',
  20: 'You are not authorized to request the resource',
  30: 'You are not allowed to request the resource',
  40: 'There are invalid parameters',
  50: 'Failed to request external service',
};

const errorCodesList = readdirSync(domainsBaseDirectory)
  .map(getFileAbsolutePath)
  .filter(existsModule)
  .map(requireModule)
  .concat(othersErrorCodes);

const errorCodesObject = Object.assign.apply(null, [{}, ...errorCodesList]);

export default errorCodesObject;
