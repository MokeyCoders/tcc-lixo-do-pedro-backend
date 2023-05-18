import { validateBody } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'post',
    path: '/login',
    handlers: [
      validateBody(validators.login),
      controllers.login,
    ],
  },
  {
    method: 'put',
    path: '/login',
    handlers: [
      controllers.refresh,
    ],
  },
];

export default routes;
