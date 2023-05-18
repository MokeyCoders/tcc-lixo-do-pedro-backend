import BaseModel from '~/models';

class Solo extends BaseModel {

  static tableName = 'solos';
  static idColumn = 'id';

  id: number;
  nome: string;

}

export default Solo;
