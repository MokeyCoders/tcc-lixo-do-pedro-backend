import { Request, Response, NextFunction } from 'express';
import pick from 'lodash.pick';

import BadRequestError from '~/errors/bad-request-error';
import ConflictError from '~/errors/conflict-error';
import NotFoundError from '~/errors/not-found-error';
import {
  throwUnlessCanCreate,
  throwUnlessCanRead, throwUnlessCanUpdate,
} from '~/helpers/ability';
import { foreignKeyConstraintFails } from '~/helpers/database';

import Genero from './model';

function catchCallback(error: unknown) {
  if (foreignKeyConstraintFails(error, 'familia_id')) {
    return new BadRequestError(401);
  }

  return error;
}

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const generoQuery = Genero.query()
      .modify('fetchList')
      .page(pagination.page, pagination.limit);

    request.filterBy?.(generoQuery);
    request.orderBy?.(generoQuery);

    const generos = await generoQuery;

    response
      .json({
        metadata: {
          total: generos.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: generos.results.length,
        },
        records: generos.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request, response: Response, next: NextFunction) {
  try {
    const { generoId } = request.params;
    const genero = await Genero.query()
      .modify('fetchOne')
      .findOne('id', generoId);
    if (!genero) {
      throw new NotFoundError();
    }

    throwUnlessCanRead(request.ability!, genero);

    response.json(genero);

  } catch (error) {
    next(error);
  }
}

async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const generoCriado = await Genero.transaction(async transacting => {
      const generoValues = pick(request.body, [
        'familia_id',
        'nome',
        'ativo',
      ]);

      throwUnlessCanCreate(request.ability!, { ...generoValues, modelName: Genero.name });

      const generoConflitante = await Genero.query(transacting)
        .select('id')
        .where('nome', 'like', generoValues.nome)
        .where('familia_id', generoValues.familia_id)
        .first();
      if (generoConflitante) {
        throw new ConflictError(400);
      }

      return Genero.query(transacting)
        .modify('fetchOne')
        .insertAndFetch(generoValues);
    });

    response.status(201)
      .json(generoCriado);
  } catch (error) {
    next(catchCallback(error));
  }
}

async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const generoAtualizado = await Genero.transaction(async transacting => {
      const { generoId } = request.params;
      const generoValues = pick(request.body, [
        'familia_id',
        'nome',
        'ativo',
      ]);

      const genero = await Genero.query(transacting)
        .select(['id', 'familia_id'])
        .findOne('id', generoId);
      if (!genero) {
        throw new NotFoundError();
      }

      const updateFields = Object.keys(generoValues);
      throwUnlessCanUpdate(request.ability!, genero, updateFields);

      if (generoValues.nome) {
        const familiaId = generoValues.familia_id || genero.familia_id;
        const generoConflitante = await Genero.query(transacting)
          .select('id')
          .where('nome', 'like', generoValues.nome)
          .where('familia_id', familiaId)
          .where('id', '!=', generoId)
          .first();
        if (generoConflitante) {
          throw new ConflictError(400);
        }
      }

      return genero.$query(transacting)
        .modify('fetchOne')
        .updateAndFetch(generoValues);
    });

    response.status(200)
      .json(generoAtualizado);
  } catch (error) {
    next(catchCallback(error));
  }
}

export default {
  find,
  findOne,
  create,
  update,
};
