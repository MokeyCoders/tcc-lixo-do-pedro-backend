import queriesMiddleware from '~/middlewares/queries';
import { validateQuery } from '~/middlewares/validations';

import controllers from './controllers';
import validators from './validators';

const routes: App.Route[] = [
  {
    public: true,
    method: 'get',
    path: '/tombos/heatmap-coordinates',
    handlers: [
      controllers.heatMapCoordinates,
    ],
  },
  {
    public: true,
    method: 'get',
    path: '/tombos/with-area',
    handlers: [
      controllers.findAllTombosWhitArea,
    ],
  },
  {
    public: true,
    method: 'get',
    path: '/tombos',
    handlers: [
      validateQuery(validators.findQueryParams),
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    public: true,
    method: 'get',
    path: '/tombos/:tomboId',
    handlers: [
      controllers.findOne,
    ],
  },
];

export default routes;
