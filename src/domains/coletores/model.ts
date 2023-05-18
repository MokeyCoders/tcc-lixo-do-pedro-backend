import BaseModel from '~/models';

class Coletor extends BaseModel {

  static tableName = 'coletores';
  static idColumn = 'id';

  id: number;
  nome: string;
  email?: string;
  numero?: number;
  ativo?: boolean;

  $hiddenFields = [
    'email',
    'numero',
    'data_criacao',
    'created_at',
    'updated_at',
    'ativo',
  ];

}

export default Coletor;
