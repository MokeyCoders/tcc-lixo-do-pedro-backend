import jwt, {
  Secret, SignOptions, VerifyOptions, JwtPayload,
} from 'jsonwebtoken';

import authConfig from '~/config/auth';

export type JwtUserPayload = JwtPayload & {
  id: number;
};

export function generateJwt(payload: JwtPayload) {
  const privateKey: Secret = {
    passphrase: '',
    key: authConfig.privateKey,
  };
  const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: authConfig.expires,
  };
  return jwt.sign(payload, privateKey, signOptions);
}

export function validateJwt(token: string): JwtUserPayload {
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };
  return jwt.verify(token, authConfig.publicKey, verifyOptions) as JwtUserPayload;
}
