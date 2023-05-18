import BaseModel from '~/models';

class Tipo extends BaseModel {

  static tableName = 'tipos';
  static idColumn = 'id';

  id: number;
  nome: string;

}

export default Tipo;
