import BaseModel from '~/models';

class Vegetacao extends BaseModel {

  static tableName = 'vegetacoes';
  static idColumn = 'id';

  id: number;
  nome: string;

}

export default Vegetacao;
