import {
  AnyQueryBuilder,
  Modifiers,
  RelationMappings,
} from 'objection';

import knex from '~/factories/knex';
import BaseModel from '~/models';

import TomboFoto from '../tombos-fotos/model';

class Tombo extends BaseModel {

  static tableName = 'tombos';
  static idColumn = 'hcf';

  hcf: number;
  latitude?: number;
  longitude?: number;

  $hiddenFields: string[] = [];

  static relationMappings: RelationMappings = {
    herbario: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'herbarios/model',
      join: {
        from: 'tombos.entidade_id',
        to: 'herbarios.id',
      },
    },
    familia: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'familias/model',
      join: {
        from: 'tombos.familia_id',
        to: 'familias.id',
      },
    },
    subfamilia: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'subfamilias/model',
      join: {
        from: 'tombos.sub_familia_id',
        to: 'sub_familias.id',
      },
    },
    especie: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'especies/model',
      join: {
        from: 'tombos.especie_id',
        to: 'especies.id',
      },
    },
    subespecie: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'subespecies/model',
      join: {
        from: 'tombos.sub_especie_id',
        to: 'sub_especies.id',
      },
    },
    variedade: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'variedades/model',
      join: {
        from: 'tombos.variedade_id',
        to: 'variedades.id',
      },
    },
    tipo: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'tipos/model',
      join: {
        from: 'tombos.tipo_id',
        to: 'tipos.id',
      },
    },
    genero: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'generos/model',
      join: {
        from: 'tombos.genero_id',
        to: 'generos.id',
      },
    },
    coletores: {
      relation: Tombo.ManyToManyRelation,
      modelClass: 'coletores/model',
      join: {
        from: 'tombos.hcf',
        through: {
          from: 'tombos_coletores.tombo_hcf',
          to: 'tombos_coletores.coletor_id',
        },
        to: 'coletores.id',
      },
    },
    local_coleta: {
      relation: Tombo.BelongsToOneRelation,
      modelClass: 'locais-coletas/model',
      join: {
        from: 'tombos.local_coleta_id',
        to: 'locais_coleta.id',
      },
    },
    fotos: {
      relation: TomboFoto.HasManyRelation,
      modelClass: 'tombos-fotos/model',
      join: {
        from: 'tombos.hcf',
        to: 'tombos_fotos.tombo_hcf',
      },
    },
  };

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchList(tomboQb) {
      tomboQb
        .select([
          'tombos.hcf',
          'tombos.cor',
          'tombos.numero_coleta',
          'tombos.data_tombo',
          'tombos.data_coleta_dia',
          'tombos.data_coleta_mes',
          'tombos.data_coleta_ano',
          'tombos.nome_cientifico',
          'tombos.nomes_populares',
          'tombos.latitude',
          'tombos.longitude',
          {
            foto_principal: knex
              .select('tombos_fotos.caminho_foto')
              .from('tombos_fotos')
              .where({
                'tombos_fotos.tombo_hcf': knex.ref('tombos.hcf'),
                'tombos_fotos.ativo': true,
              })
              .orderBy('tombos_fotos.sequencia', 'asc')
              .first(),
          },
        ])
        .withGraphFetched({
          local_coleta: {
            cidade: {
              estado: true,
            },
          },
        })
        .modifyGraph('local_coleta', localColetaQb => {
          localColetaQb
            .select([
              'locais_coleta.id',
              'locais_coleta.descricao',
              'locais_coleta.complemento',
            ]);
        })
        .modifyGraph('local_coleta.cidade', cidadeQb => {
          cidadeQb
            .select([
              'id',
              'nome',
              'latitude',
              'longitude',
            ]);
        })
        .modifyGraph('local_coleta.cidade.estado', estadoQb => {
          estadoQb
            .select([
              'id',
              'nome',
            ]);
        });
    },
    fetchOne(tomboQb) {
      tomboQb
        .select([
          'tombos.hcf',
          'tombos.cor',
          'tombos.numero_coleta',
          'tombos.data_tombo',
          'tombos.data_coleta_dia',
          'tombos.data_coleta_mes',
          'tombos.data_coleta_ano',
          'tombos.latitude',
          'tombos.longitude',
          'tombos.altitude',
          'tombos.nome_cientifico',
          'tombos.nomes_populares',
        ])
        .withGraphFetched({
          herbario: true,
          familia: true,
          subfamilia: {
            familia: true,
          },
          especie: true,
          subespecie: {
            especie: true,
          },
          coletores: true,
          variedade: true,
          tipo: true,
          genero: true,
          local_coleta: {
            vegetacao: true,
            solo: true,
            relevo: true,
            fase_sucessional: true,
            cidade: {
              estado: true,
            },
          },
          fotos: true,
        })
        .modifyGraph('herbario', herbarioQb => {
          herbarioQb
            .select([
              'id',
              'nome',
              'sigla',
            ]);
        })
        .modifyGraph('familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('subfamilia', subfamiliaQb => {
          subfamiliaQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('subfamilia.familia', familiaQb => {
          familiaQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('especie', especieQb => {
          especieQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('subespecie', subespecieQb => {
          subespecieQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('subespecie.especie', especieQb => {
          especieQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('variedade', variedadeQb => {
          variedadeQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('tipo', tipoQb => {
          tipoQb
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
        .modifyGraph('local_coleta', localColetaQb => {
          localColetaQb
            .select([
              'id',
              'descricao',
              'complemento',
            ]);
        })
        .modifyGraph('local_coleta.vegetacao', vegetacaoQb => {
          vegetacaoQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('local_coleta.solo', soloQb => {
          soloQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('local_coleta.relevo', relevoQb => {
          relevoQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('local_coleta.fase_sucessional', faseSucessionalQb => {
          faseSucessionalQb
            .select([
              'numero',
              'nome',
            ]);
        })
        .modifyGraph('local_coleta.cidade', cidadeQb => {
          cidadeQb
            .select([
              'id',
              'nome',
              'latitude',
              'longitude',
            ]);
        })
        .modifyGraph('local_coleta.cidade.estado', estadoQb => {
          estadoQb
            .select([
              'id',
              'nome',
            ]);
        })
        .modifyGraph('fotos', fotoQb => {
          fotoQb
            .select([
              'id',
              'caminho_foto',
              'em_vivo',
              'sequencia',
            ])
            .where('ativo', true)
            .orderBy('sequencia', 'asc');
        });
    },
  };

}

export default Tombo;
