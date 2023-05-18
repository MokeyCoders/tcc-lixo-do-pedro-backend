import queriesMiddleware from '~/middlewares/queries';
import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    method: 'get',
    path: '/autores',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/autores/:autorId',
    handlers: [
      queriesMiddleware,
      controllers.findOne,
    ],
  },
  {
    method: 'post',
    path: '/autores',
    handlers: [
      validateBody(validators.create),
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/autores/:autorId',
    handlers: [
      validateBody(validators.update),
      controllers.update,
    ],
  },
  {
    method: 'delete',
    path: '/autores/:autorId',
    handlers: [
      controllers.remove,
    ],
  },
];

export default routes;
