import createAttachmentMiddleware from '~/middlewares/attachments';
import mimetypes from '~/resources/mimetypes';

import controllers from './controllers';

export default [
  {
    method: 'post',
    path: '/anexos',
    handlers: [
      createAttachmentMiddleware('file', mimetypes),
      controllers.upload,
    ],
  },
];
