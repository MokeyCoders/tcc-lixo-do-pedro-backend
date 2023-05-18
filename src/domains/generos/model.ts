import { AnyQueryBuilder, Modifiers, RelationMappings } from 'objection';

import BaseModel from '~/models';

class Genero extends BaseModel {

  static tableName = 'generos';
  static idColumn = 'id';

  id: number;
  nome: string;
  familia_id: number;
  ativo?: boolean;

  $hiddenFields: string[] = [
    'familia_id',
  ];

  static relationMappings: RelationMappings = {
    familia: {
      relation: Genero.BelongsToOneRelation,
      modelClass: 'familias/model',
      join: {
        from: 'generos.familia_id',
        to: 'familias.id',
      },
    },
  };

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchList(generoQb) {
      generoQb
        .withGraphFetched({
          familia: true,
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
    fetchOne(generoQb) {
      generoQb
        .withGraphFetched({
          familia: true,
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
  };

}

export default Genero;
