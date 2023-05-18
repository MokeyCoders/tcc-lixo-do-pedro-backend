import BaseModel from '~/models';

class Variedade extends BaseModel {

  static tableName = 'variedades';
  static idColumn = 'id';

  id: number;
  nome: string;
  ativo?: boolean;

}

export default Variedade;
