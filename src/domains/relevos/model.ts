import BaseModel from '~/models';

class Relevo extends BaseModel {

  static tableName = 'relevos';
  static idColumn = 'id';

  id: number;
  nome: string;

}

export default Relevo;
