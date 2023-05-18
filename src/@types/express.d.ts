declare namespace Express {
  namespace Multer {
    interface File {
      metadata?: import('sharp').Metadata;
    }
  }

  interface Request {
    user?: import('~/domains/usuarios/model').default;
    ability?: App.Permission.AppAbility;
    filterBy?: (builder: import('objection').QueryBuilderType) => import('objection').QueryBuilderType;
    orderBy?: (builder: import('objection').QueryBuilderType) => import('objection').QueryBuilderType;
    pagination?: {
      page: number;
      limit: number;
    }
  }
}
