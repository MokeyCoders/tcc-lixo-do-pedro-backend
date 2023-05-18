import { NextFunction, Request, Response } from 'express';
import { renameSync } from 'fs';
import { PartialModelObject } from 'objection';

import { resolveAttachmentPaths } from '~/helpers/storage';

import Anexo from './model';

async function upload(request: Request, response: Response, next: NextFunction) {
  try {
    const file = request.file!;
    const paths = resolveAttachmentPaths(file.filename);

    let values: PartialModelObject<Anexo> = {
      mimetype: file.mimetype,
      tamanho: file.size,
      caminho: paths.relative,
      nome_original: file.originalname,
    };
    if (file.metadata) {
      const { metadata } = file;
      values = {
        ...values,
        imagem_largura: metadata.width,
        imagem_altura: metadata.height,
      };
    }

    renameSync(file.path, paths.absolute);

    const anexo = await Anexo.query()
      .insert(values);

    response.status(201)
      .json(anexo);
  } catch (error) {
    next(error);
  }
}

export default {
  upload,
};
