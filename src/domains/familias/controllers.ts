import { Request, Response, NextFunction } from 'express';
import pick from 'lodash.pick';

import ConflictError from '~/errors/conflict-error';
import NotFoundError from '~/errors/not-found-error';

import Familia from './model';

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const familiaQuery = Familia.query()
      .page(pagination.page, pagination.limit);

    request.filterBy?.(familiaQuery);
    request.orderBy?.(familiaQuery);

    const familias = await familiaQuery;

    response
      .json({
        metadata: {
          total: familias.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: familias.results.length,
        },
        records: familias.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request, response: Response, next: NextFunction) {
  try {
    const { familiaId } = request.params;
    const familia = await Familia.query()
      .findOne('id', familiaId);
    if (!familia) {
      throw new NotFoundError();
    }

    response
      .json(familia);

  } catch (error) {
    next(error);
  }
}

async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const familiaCriada = await Familia.transaction(async transacting => {
      const familiaValues = pick(request.body, [
        'nome',
        'ativo',
      ]);

      const familia = await Familia.query(transacting)
        .select('id')
        .findOne('nome', 'like', familiaValues.nome);
      if (familia) {
        throw new ConflictError(200);
      }

      return Familia.query(transacting)
        .insertAndFetch(familiaValues);
    });

    response.status(201)
      .json(familiaCriada);
  } catch (error) {
    next(error);
  }
}

async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const familiaAtualizada = await Familia.transaction(async transacting => {
      const { familiaId } = request.params;
      const familiaValues = pick(request.body, [
        'nome',
        'ativo',
      ]);

      const familia = await Familia.query(transacting)
        .select('id')
        .findOne('id', familiaId);
      if (!familia) {
        throw new NotFoundError();
      }

      if (familiaValues.nome) {
        const familiaConflitante = await Familia.query(transacting)
          .select('id')
          .where('id', '!=', familiaId)
          .findOne('nome', 'like', familiaValues.nome);
        if (familiaConflitante) {
          throw new ConflictError(200);
        }
      }

      return familia.$query(transacting)
        .updateAndFetch(familiaValues);
    });

    response.status(200)
      .json(familiaAtualizada);
  } catch (error) {
    next(error);
  }
}

async function remove(request: Request, response: Response, next: NextFunction) {
  try {
    await Familia.transaction(async transacting => {
      const { familiaId } = request.params;

      const family = await Familia.query(transacting)
        .select('id')
        .findOne({
          ativo: true,
          id: familiaId,
        });
      if (!family) {
        throw new NotFoundError();
      }

      await Familia.query(transacting)
        .where('id', '=', familiaId)
        .patch({ ativo: false });

      response.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
}

export default {
  find,
  findOne,
  create,
  update,
  remove,
};
