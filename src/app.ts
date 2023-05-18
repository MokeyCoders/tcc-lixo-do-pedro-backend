import { json as parseJSON } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import NotFoundError from './errors/not-found-error';
import errorMiddleware from './middlewares/errors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: global.__PROD__ }));
app.use(parseJSON());
app.use(morgan('dev'));
app.use(routes);
app.use(() => { throw new NotFoundError(10); });
app.use(errorMiddleware);

export default app;
