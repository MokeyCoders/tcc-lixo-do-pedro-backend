import omit from 'lodash.omit';
import {
  AnyQueryBuilder,
  Model, Modifiers,
  Pojo, RelationMappings,
} from 'objection';
import path from 'path';

import knex from './factories/knex';

Model.knex(knex);

class BaseModel extends Model {

  static get modelPaths() {
    return [path.resolve(__dirname, 'domains')];
  }

  $hiddenFields: string[] = [];

  $formatJson(json: Pojo) {
    const jsonFormatted = super.$formatJson(json);
    if (this.$hiddenFields.length) {
      return omit(jsonFormatted, this.$hiddenFields);
    }
    return jsonFormatted;
  }

  static relationMappings: RelationMappings = {};

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchOne() {
    },
    fetchList() {
    },
  };

}

export default BaseModel;
