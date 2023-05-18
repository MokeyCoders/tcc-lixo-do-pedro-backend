import BaseModel from '~/models';

class TomboFoto extends BaseModel {

  static tableName = 'tombos_fotos';
  static idColumn = 'id';

  id: number;
  caminho_foto: string;
  ativo?: boolean;

  $hiddenFields = [
    'tombo_hcf',
    'created_at',
    'updated_at',
    'ativo',
  ];

}

export default TomboFoto;
