import queriesMiddleware from '~/middlewares/queries';
import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'get',
    path: '/subfamilias',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/subfamilias/:subfamiliaId',
    handlers: [
      queriesMiddleware,
      controllers.findOne,
    ],
  },
  {
    method: 'post',
    path: '/subfamilias',
    handlers: [
      validateBody(validators.create),
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/subfamilias/:subfamiliaId',
    handlers: [
      validateBody(validators.update),
      controllers.update,
    ],
  },
];

export default routes;
