import createKnex from 'knex';

import databaseConfig from '~/config/database';

const knex = createKnex({
  client: 'mysql2',
  useNullAsDefault: true,
  debug: true,
  connection: {
    database: databaseConfig.database,
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    charset: databaseConfig.charset,

    decimalNumbers: true,

    typeCast(field: any, next: Function) {
      const { type, length, string } = field;

      if (type === 'TINY' && length === 1) {
        const value = string();
        switch (value) {
          case '1': return true;
          case '0': return false;
          default: return value;
        }
      }

      return next();
    },

  },
});

export default knex;
