/* eslint-disable no-console, no-inner-declarations */
import './setup';
import cluster from 'cluster';
import http from 'http';
import os from 'os';

import app from './app';
import appConfig from './config/app';

interface ListenError extends Error {
  code: string;
  syscall: string;
}

function startServer() {
  return new Promise<void>((resolve, reject) => {
    http.createServer(app)
      .on('listening', () => {
        console.info(`Worker ${process.pid} started on port ${appConfig.port}`);
        resolve();
      })
      .on('error', (error: ListenError) => {
        if (error.syscall !== 'listen') {
          reject(error);
          return;
        }

        switch (error.code) {
          case 'EACCES':
            console.error(`Port ${appConfig.port} requires elevated privileges`);
            break;
          case 'EADDRINUSE':
            console.error(`Port ${appConfig.port} is already in use`);
            break;
          default:
            break;
        }

        reject(error);
      })
      .listen(appConfig.port);
  });
}

if (cluster.isMaster) {
  console.info(`Using "${appConfig.environment}" environment`);
  console.info(`Master ${process.pid} is running`);

  function forkCluster() {
    cluster.on('exit', (worker, code, signal) => {
      console.warn(`Worker ${worker.process.pid} died with ${code} code and ${signal} signal.`);
      process.exit(1);
    });

    for (let i = 0; i < os.cpus().length; i += 1) {
      cluster.fork();
    }
  }

  async function initServer() {
    if (global.__PROD__) {
      forkCluster();
    } else {
      await startServer();
    }
  }

  Promise.resolve()
    .then(initServer)
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

} else {
  Promise.resolve()
    .then(startServer)
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
