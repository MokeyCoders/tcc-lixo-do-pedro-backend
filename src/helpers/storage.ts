import format from 'date-fns/format';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

import attachmentConfig from '~/config/attachment';

export function getImageMetadata(path: string) {
  return sharp(path)
    .metadata();
}

function getRelativeDir() {
  return format(new Date(), 'yyyy-MM');
}

export function resolveAttachmentPaths(fileName: string) {
  const relativePath = getRelativeDir();
  const absolutePath = join(attachmentConfig.baseAbsolutePath, relativePath);

  if (!existsSync(absolutePath)) {
    mkdirSync(absolutePath, { recursive: true });
  }

  return {
    relative: join(relativePath, fileName),
    absolute: join(absolutePath, fileName),
  };
}

export default {};
