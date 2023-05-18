import BaseModel from '~/models';

class FaseSucessional extends BaseModel {

  static tableName = 'fase_sucessional';
  static idColumn = 'numero';

  numero: number;
  nome: string;

}

export default FaseSucessional;
