import queriesMiddleware from '~/middlewares/queries';
import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'get',
    path: '/especies',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/especies/:especieId',
    handlers: [
      queriesMiddleware,
      controllers.findOne,
    ],
  },
  {
    method: 'post',
    path: '/especies',
    handlers: [
      validateBody(validators.create),
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/especies/:especieId',
    handlers: [
      validateBody(validators.update),
      controllers.update,
    ],
  },
  {
    method: 'delete',
    path: '/especies/:especieId',
    handlers: [
      controllers.remove,
    ],
  },
];

export default routes;
