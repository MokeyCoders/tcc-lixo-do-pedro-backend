import dotenv from 'dotenv';
import { Knex } from 'knex';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

const {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PORT = '3306',
  MYSQL_MIGRATION_USERNAME,
  MYSQL_MIGRATION_PASSWORD,
} = process.env;

const knexConfig: Knex.Config = {
  client: 'mysql2',
  debug: true,
  connection: {
    database: MYSQL_DATABASE,
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_MIGRATION_USERNAME,
    password: MYSQL_MIGRATION_PASSWORD,
  },
  pool: {
    afterCreate(conn: any, done: (error: Error, connection: any) => void) {
      conn.query('SET sql_require_primary_key=0;', (err: Error) => {
        done(err, conn);
      });
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
    stub: './migration.stub',
  },
};

module.exports = knexConfig;
