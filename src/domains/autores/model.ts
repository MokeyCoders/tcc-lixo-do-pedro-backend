import BaseModel from '~/models';

class Autor extends BaseModel {

  static tableName = 'autores';
  static idColumn = 'id';

  id: number;
  nome: string;
  iniciais?: string;
  ativo?: boolean;

}

export default Autor;
