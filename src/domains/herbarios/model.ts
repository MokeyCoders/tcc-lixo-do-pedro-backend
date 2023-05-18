import BaseModel from '~/models';

class Herbario extends BaseModel {

  static tableName = 'herbarios';
  static idColumn = 'id';

  id: number;
  nome: string;
  sigla: string;
  email?: string;
  ativo?: boolean;

  $hiddenFields: string[] = [
    'endereco_id',
    'updated_at',
  ];

}

export default Herbario;
