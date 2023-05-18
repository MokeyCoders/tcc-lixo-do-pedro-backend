import BaseModel from '~/models';

class Estado extends BaseModel {

  static tableName = 'estados';
  static idColumn = 'id';

  id: number;
  nome: string;
  codigo_telefone?: number;

}

export default Estado;
