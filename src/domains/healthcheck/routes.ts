import controllers from './controllers';

const routes: App.Route[] = [
  {
    public: true,
    internal: true,
    method: 'get',
    path: '/healthcheck',
    handlers: [
      controllers.healthcheck,
    ],
  },
];

export default routes;
