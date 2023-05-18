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

import Subfamilia from './model';

function catchCallback(error: unknown) {
  if (foreignKeyConstraintFails(error, 'autor_id')) {
    return new BadRequestError(301);
  }
  if (foreignKeyConstraintFails(error, 'familia_id')) {
    return new BadRequestError(302);
  }

  return error;
}

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const subfamiliaQuery = Subfamilia.query()
      .modify('fetchList')
      .page(pagination.page, pagination.limit);

    request.filterBy?.(subfamiliaQuery);
    request.orderBy?.(subfamiliaQuery);

    const subfamilias = await subfamiliaQuery;

    response
      .json({
        metadata: {
          total: subfamilias.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: subfamilias.results.length,
        },
        records: subfamilias.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request, response: Response, next: NextFunction) {
  try {
    const { subfamiliaId } = request.params;
    const subfamilia = await Subfamilia.query()
      .modify('fetchOne')
      .findOne('id', subfamiliaId);
    if (!subfamilia) {
      throw new NotFoundError();
    }

    throwUnlessCanRead(request.ability!, subfamilia);

    response.json(subfamilia);

  } catch (error) {
    next(error);
  }
}

async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const subfamiliaCriada = await Subfamilia.transaction(async transacting => {
      const subfamiliaValues = pick(request.body, [
        'autor_id',
        'familia_id',
        'nome',
        'ativo',
      ]);

      throwUnlessCanCreate(request.ability!, { ...subfamiliaValues, modelName: Subfamilia.name });

      const subfamiliaConflitante = await Subfamilia.query(transacting)
        .select('id')
        .where('nome', 'like', subfamiliaValues.nome)
        .where('familia_id', subfamiliaValues.familia_id)
        .first();
      if (subfamiliaConflitante) {
        throw new ConflictError(300);
      }

      return Subfamilia.query(transacting)
        .modify('fetchOne')
        .insertAndFetch(subfamiliaValues);
    });

    response.status(201)
      .json(subfamiliaCriada);
  } catch (error) {
    next(catchCallback(error));
  }
}

async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const subfamiliaAtualizada = await Subfamilia.transaction(async transacting => {
      const { subfamiliaId } = request.params;
      const subfamiliaValues = pick(request.body, [
        'autor_id',
        'familia_id',
        'nome',
        'ativo',
      ]);

      const subfamilia = await Subfamilia.query(transacting)
        .select(['id', 'familia_id'])
        .findOne('id', subfamiliaId);
      if (!subfamilia) {
        throw new NotFoundError();
      }

      const updateFields = Object.keys(subfamiliaValues);
      throwUnlessCanUpdate(request.ability!, subfamilia, updateFields);

      if (subfamiliaValues.nome) {
        const familiaId = subfamiliaValues.familia_id || subfamilia.familia_id;
        const familiaConflitante = await Subfamilia.query(transacting)
          .select('id')
          .where('nome', 'like', subfamiliaValues.nome)
          .where('familia_id', familiaId)
          .where('id', '!=', subfamiliaId)
          .first();
        if (familiaConflitante) {
          throw new ConflictError(300);
        }
      }

      return subfamilia.$query(transacting)
        .modify('fetchOne')
        .updateAndFetch(subfamiliaValues);
    });

    response.status(200)
      .json(subfamiliaAtualizada);
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
