import {
  AnyQueryBuilder,
  ModelOptions, Modifiers,
  QueryContext,
  RelationMappings,
} from 'objection';

import { generateHash, validateHash } from '~/helpers/bcrypt';
import BaseModel from '~/models';

import Herbario from '../herbarios/model';
import TipoUsuario from '../tipos-usuarios/model';

class Usuario extends BaseModel {

  static get tableName() {
    return 'usuarios';
  }

  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  herbario: Herbario;
  tipo?: TipoUsuario;

  isSenhaCorreta(senha: string) {
    try {
      return Boolean(this.senha) && validateHash(senha, this.senha);
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  $beforeInsert(queryContext: QueryContext): Promise<any> | void {
    super.$beforeInsert(queryContext);

    if (this.senha) {
      this.senha = generateHash(this.senha);
    }
  }

  $beforeUpdate(options: ModelOptions & { old: Usuario }, queryContext: QueryContext): Promise<any> | void {
    super.$beforeUpdate(options, queryContext);

    const { old: previous } = options;
    if (this.senha && this.senha !== previous.senha) {
      this.senha = generateHash(this.senha);
    }
  }

  $hiddenFields: string[] = [
    'senha',
    'herbario_id',
    'tipo_usuario_id',
    'updated_at',
  ];

  static relationMappings: RelationMappings = {
    herbario: {
      relation: Usuario.BelongsToOneRelation,
      modelClass: Herbario,
      join: {
        from: 'usuarios.herbario_id',
        to: 'herbarios.id',
      },
    },
    tipo: {
      relation: Usuario.BelongsToOneRelation,
      modelClass: TipoUsuario,
      join: {
        from: 'usuarios.tipo_usuario_id',
        to: 'tipos_usuarios.id',
      },
    },
  };

  static modifiers: Modifiers<AnyQueryBuilder> = {
    fetchAuth(usuarioQb) {
      usuarioQb
        .select([
          'id',
          'nome',
          'senha',
        ])
        .withGraphFetched({
          herbario: true,
          tipo: true,
        })
        .modifyGraph('herbario', herbarioQb => {
          herbarioQb.select([
            'id',
            'nome',
          ]);
        })
        .modifyGraph('tipo', tipoUsuarioQb => {
          tipoUsuarioQb.select([
            'id',
            'tipo',
          ]);
        });
    },
  };

}

export default Usuario;
