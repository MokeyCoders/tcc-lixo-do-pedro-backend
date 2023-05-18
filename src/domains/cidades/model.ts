import { RelationMappings } from 'objection';

import BaseModel from '~/models';

class Cidade extends BaseModel {

  static tableName = 'cidades';
  static idColumn = 'id';

  id: number;
  nome: string;
  latitude?: number;
  longitude?: number;

  $hiddenFields = [
    'estado_id',
    'created_at',
    'updated_at',
    'ativo',
  ];

  static relationMappings: RelationMappings = {
    estado: {
      relation: Cidade.BelongsToOneRelation,
      modelClass: 'estados/model',
      join: {
        from: 'cidades.estado_id',
        to: 'estados.id',
      },
    },
  };

}

export default Cidade;
