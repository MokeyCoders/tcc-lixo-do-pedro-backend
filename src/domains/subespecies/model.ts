import { RelationMappings } from 'objection';

import BaseModel from '~/models';

class Subespecie extends BaseModel {

  static tableName = 'sub_especies';
  static idColumn = 'id';

  id: number;
  nome: string;
  ativo?: boolean;

  static relationMappings: RelationMappings = {
    especie: {
      relation: Subespecie.BelongsToOneRelation,
      modelClass: 'especies/model',
      join: {
        from: 'sub_especies.especie_id',
        to: 'especies.id',
      },
    },
  };

}

export default Subespecie;
