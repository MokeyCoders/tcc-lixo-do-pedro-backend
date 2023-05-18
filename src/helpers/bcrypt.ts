import bcrypt from 'bcryptjs';

const BCRYPT_SALT_LENGTH = 12;

export function generateHash(value: string) {
  return bcrypt.hashSync(value, BCRYPT_SALT_LENGTH);
}

export function validateHash(value: string, hash: string) {
  return bcrypt.compareSync(value, hash);
}
