import BaseModel from '~/models';

class TomboColetor extends BaseModel {

  static tableName = 'tombos_coletores';
  static idColumn = ['tombo_hcf', 'coletor_id'];

  tombo_hcf: number;
  coletor_id: number;
  principal: boolean;

}

export default TomboColetor;
