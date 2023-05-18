import { AnyQueryBuilder, Modifiers, RelationMappings } from 'objection';

import BaseModel from '~/models';

class Especie extends BaseModel {

  static tableName = 'especies';
  static idColumn = 'id';

  id: number;
  nome: string;
  ativo?: boolean;

  $hiddenFields: string[] = [
    'familia_id',
    'genero_id',
    'autor_id',
  ];

  static relationMappings: RelationMappings = {
    familia: {
      relation: Especie.BelongsToOneRelation,
      modelClass: 'familias/model',
      join: {
        from: 'especies.familia_id',
        to: 'familias.id',
      },
    },
    genero: {
      relation: Especie.BelongsToOneRelation,
      modelClass: 'generos/model',
      join: {
        from: 'especies.familia_id',
        to: 'generos.id',
      },
    },
    autor: {
      relation: Especie.BelongsToOneRelation,
      modelClass: 'autores/model',
      join: {
        from: 'especies.autor_id',
        to: 'autores.id',
      },
    },
  };

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchList(especieQb) {
      especieQb
        .withGraphFetched({
          familia: true,
          genero: true,
          autor: true,
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('genero', generoQb => {
          generoQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('autor', autorQb => {
          autorQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
    fetchOne(especieQb) {
      especieQb
        .withGraphFetched({
          autor: true,
          familia: true,
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('genero', generoQb => {
          generoQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('autor', autorQb => {
          autorQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
  };

}

export default Especie;
