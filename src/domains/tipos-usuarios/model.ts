import BaseModel from '~/models';

class TipoUsuario extends BaseModel {

  static get tableName() {
    return 'tipos_usuarios';
  }

  id: number;
  tipo?: string;

}

export default TipoUsuario;
