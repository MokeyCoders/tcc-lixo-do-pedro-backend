import { AnyQueryBuilder, Modifiers, RelationMappings } from 'objection';

import BaseModel from '~/models';

class Subfamilia extends BaseModel {

  static tableName = 'sub_familias';
  static idColumn = 'id';

  id: number;
  nome: string;
  autor_id?: number;
  familia_id: number;
  ativo?: boolean;

  $hiddenFields: string[] = [
    'autor_id',
    'familia_id',
  ];

  static relationMappings: RelationMappings = {
    autor: {
      relation: Subfamilia.BelongsToOneRelation,
      modelClass: 'autores/model',
      join: {
        from: 'sub_familias.autor_id',
        to: 'autores.id',
      },
    },
    familia: {
      relation: Subfamilia.BelongsToOneRelation,
      modelClass: 'familias/model',
      join: {
        from: 'sub_familias.familia_id',
        to: 'familias.id',
      },
    },
  };

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchList(subfamiliaQb) {
      subfamiliaQb
        .withGraphFetched({
          autor: true,
          familia: true,
        })
        .modifyGraph('autor', autorQb => {
          autorQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
    fetchOne(subfamiliaQb) {
      subfamiliaQb
        .withGraphFetched({
          autor: true,
          familia: true,
        })
        .modifyGraph('autor', autorQb => {
          autorQb
            .select([
              'id',
              'nome',
            ]);
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

export default Subfamilia;
