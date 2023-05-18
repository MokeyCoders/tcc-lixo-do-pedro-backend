import { Request, Response, NextFunction } from 'express';

import UnauthorizedError from '~/errors/unauthorized-error';
import { generateJwt, JwtUserPayload } from '~/helpers/jwt';

import Usuario from './model';
import getUserRules from './permissions';

async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const { email, senha } = request.body;

    const usuario = await Usuario.query()
      .modify('fetchAuth')
      .findOne({
        email,
        ativo: true,
      });
    if (!usuario?.isSenhaCorreta(senha)) {
      throw new UnauthorizedError(100);
    }

    const payload: JwtUserPayload = {
      id: usuario.id,
    };
    const token = generateJwt(payload);
    const regrasValidas = getUserRules(usuario);

    response.json({
      token,
      usuario,
      regras: regrasValidas,
    });

  } catch (error) {
    next(error);
  }
}

async function refresh(request: Request, response: Response, next: NextFunction) {
  try {
    const usuario = await Usuario.query()
      .modify('fetchAuth')
      .findById(request.user!.id);

    const payload: JwtUserPayload = {
      id: usuario.id,
    };
    const token = generateJwt(payload);
    const regrasValidas = getUserRules(usuario);

    response.json({
      token,
      usuario,
      regras: regrasValidas,
    });

  } catch (error) {
    next(error);
  }
}

export default {
  login,
  refresh,
};
