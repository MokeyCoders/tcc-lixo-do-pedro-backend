import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import Usuario from '~/domains/usuarios/model';
import getUserRules from '~/domains/usuarios/permissions';
import ForbiddenError from '~/errors/forbidden-error';
import UnauthorizedError from '~/errors/unauthorized-error';
import { createAbility } from '~/helpers/ability';
import { validateJwt } from '~/helpers/jwt';

type AuthData = {
  user: Usuario,
  ability: App.Permission.AppAbility
};

export function extractTokenWithScheme(scheme: string, authorizationHeaderValue?: string) {
  const [extractedScheme, extractedValue] = authorizationHeaderValue?.split(' ') || [];
  if (extractedScheme === scheme) {
    return extractedValue;
  }

  return null;
}

export async function generateAuthorizationData(authorizationHeaderValue?: string): Promise<AuthData> {
  try {
    const token = extractTokenWithScheme('Bearer', authorizationHeaderValue);
    if (!token) {
      throw new UnauthorizedError();
    }

    const decoded = validateJwt(token);
    const user = await Usuario.query()
      .modify('fetchAuth')
      .findOne({
        id: decoded.id,
        ativo: true,
      });
    if (!user) {
      throw new ForbiddenError();
    }

    const rules = getUserRules(user);
    const ability = createAbility(rules);

    return { user, ability };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError();
    }

    throw error;
  }
}

async function authorizationMiddleware(request: Request, _: Response, next: NextFunction) {
  try {
    const { ability, user } = await generateAuthorizationData(request.headers.authorization);
    request.user = user;
    request.ability = ability;
    next();

  } catch (error) {
    next(error);
  }
}

export default authorizationMiddleware;
