import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import attachmentConfig from '~/config/attachment';
import HttpError from '~/errors/http-error';
import { getImageMetadata } from '~/helpers/storage';

export const storage = multer.diskStorage({
  destination(_request, _file, callback) {
    callback(null, attachmentConfig.tempAbsolutePath);
  },

  filename(_request, file, callback) {
    const name = `${uuid()}${extname(file.originalname)}`;
    callback(null, name);
  },
});

function createMimetypeNotAllowedError(file: Express.Multer.File) {
  const report = [{
    [file.fieldname]: `${file.mimetype} mimetype is not allowed`,
  }];
  return new HttpError(406 /* Not Acceptable */, 30, report);
}

function createMulterMiddleware(field: string, allowed: RegExp[]) {
  const options: multer.Options = {
    storage,
    fileFilter(_, file, callback) {
      const accepted = allowed.some(mimetype => mimetype.test(file.mimetype));
      if (accepted) {
        callback(null, true);
      } else {
        callback(createMimetypeNotAllowedError(file));
      }
    },
    limits: {
      fileSize: attachmentConfig.maxFileSize,
      fieldSize: attachmentConfig.maxFileSize,
    },
  };

  return multer(options)
    .single(field);
}

function createSharpMiddleware(field: string) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const { file } = request;
    if (file?.fieldname === field && /^image\//.test(file.mimetype)) {
      const metadata = await getImageMetadata(file.path);
      Object.assign(file, { metadata });
    }

    next();
  };
}

export default function createAttachmentMiddleware(field: string, allowed: RegExp[]) {
  return [
    createMulterMiddleware(field, allowed),
    createSharpMiddleware(field),
  ];
}
