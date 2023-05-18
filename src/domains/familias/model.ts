import BaseModel from '~/models';

class Familia extends BaseModel {

  static tableName = 'familias';
  static idColumn = 'id';

  id: number;
  nome: string;
  ativo?: boolean;

}

export default Familia;
