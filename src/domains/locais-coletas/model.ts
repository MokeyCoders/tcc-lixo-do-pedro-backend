import { RelationMappings } from 'objection';

import BaseModel from '~/models';

class LocalColeta extends BaseModel {

  static tableName = 'locais_coleta';
  static idColumn = 'id';

  id: number;
  descricao: string;
  complemento?: string;
  fase_numero?: number;
  ativo: boolean;

  static relationMappings: RelationMappings = {
    vegetacao: {
      relation: LocalColeta.BelongsToOneRelation,
      modelClass: 'vegetacoes/model',
      join: {
        from: 'locais_coleta.vegetacao_id',
        to: 'vegetacoes.id',
      },
    },
    solo: {
      relation: LocalColeta.BelongsToOneRelation,
      modelClass: 'solos/model',
      join: {
        from: 'locais_coleta.solo_id',
        to: 'solos.id',
      },
    },
    relevo: {
      relation: LocalColeta.BelongsToOneRelation,
      modelClass: 'relevos/model',
      join: {
        from: 'locais_coleta.relevo_id',
        to: 'relevos.id',
      },
    },
    fase_sucessional: {
      relation: LocalColeta.BelongsToOneRelation,
      modelClass: 'fases-sucessionais/model',
      join: {
        from: 'locais_coleta.fase_sucessional_id',
        to: 'fase_sucessional.numero',
      },
    },
    cidade: {
      relation: LocalColeta.BelongsToOneRelation,
      modelClass: 'cidades/model',
      join: {
        from: 'locais_coleta.cidade_id',
        to: 'cidades.id',
      },
    },
  };

}

export default LocalColeta;
