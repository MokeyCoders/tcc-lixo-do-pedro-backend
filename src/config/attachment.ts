import path from 'path';

const { STORAGE_PATH } = process.env;

export default {
  maxFileSize: (25 * 1024 * 1024), // 25 MB
  baseAbsolutePath: STORAGE_PATH!,
  tempAbsolutePath: path.join(STORAGE_PATH!, 'temp'),
};
