declare namespace App {
  type Route = {
    public?: boolean;
    internal?: boolean;
    method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
    path: string;
    handlers: import('express').RequestHandler<any>[];
  };

  namespace Permission {
    type Action = 'menu' | 'manage' | 'create' | 'update' | 'read' | 'find' | 'delete';

    type Subject = import('objection').Model | string | {
      [key: string]: any;
      modelName: string;
    };

    type AppAbility = import('@casl/ability').Ability<[App.Permission.Action, App.Permission.Subject]>;

    type PermCallback = (user: import('~/domains/usuarios/model').default) => boolean;

    type Rule = import('@casl/ability').RawRuleOf<AppAbility> & {
      permissions?: Array<import('~/domains/usuarios/model').UsuarioPapel | PermCallback | boolean>;
    };
  }
}
