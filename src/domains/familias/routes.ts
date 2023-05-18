import queriesMiddleware from '~/middlewares/queries';
import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'get',
    path: '/familias',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/familias/:familiaId',
    handlers: [
      queriesMiddleware,
      controllers.findOne,
    ],
  },
  {
    method: 'post',
    path: '/familias',
    handlers: [
      validateBody(validators.create),
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/familias/:familiaId',
    handlers: [
      validateBody(validators.update),
      controllers.update,
    ],
  },
  {
    method: 'delete',
    path: '/familias/:familiaId',
    handlers: [
      controllers.remove,
    ],
  },
];

export default routes;
