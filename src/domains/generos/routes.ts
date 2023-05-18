import queriesMiddleware from '~/middlewares/queries';
import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'get',
    path: '/generos',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/generos/:generoId',
    handlers: [
      queriesMiddleware,
      controllers.findOne,
    ],
  },
  {
    method: 'post',
    path: '/generos',
    handlers: [
      validateBody(validators.create),
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/generos/:generoId',
    handlers: [
      validateBody(validators.update),
      controllers.update,
    ],
  },
];

export default routes;
