import BaseModel from '~/models';

class Anexo extends BaseModel {

  static get tableName() {
    return 'anexos';
  }

  id: number;

  mimetype: string;

  tamanho: number;

  nome_original: string;

  caminho: string;

  imagem_largura: number;

  imagem_altura: number;

  get $hiddenFields(): string[] {
    return [];
  }

}

export default Anexo;
