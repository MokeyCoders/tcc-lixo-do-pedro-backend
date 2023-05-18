import { Request, Response, NextFunction } from 'express';
import pick from 'lodash.pick';

import BadRequestError from '~/errors/bad-request-error';
import ConflictError from '~/errors/conflict-error';
import NotFoundError from '~/errors/not-found-error';
import { foreignKeyConstraintFails } from '~/helpers/database';

import Especie from './model';

function catchCallback(error: unknown) {
  if (foreignKeyConstraintFails(error, 'familia_id')) {
    return new BadRequestError(601);
  }
  if (foreignKeyConstraintFails(error, 'genero_id')) {
    return new BadRequestError(602);
  }
  if (foreignKeyConstraintFails(error, 'autor_id')) {
    return new BadRequestError(603);
  }

  return error;
}

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const especieQuery = Especie.query()
      .page(pagination.page, pagination.limit);

    request.filterBy?.(especieQuery);
    request.orderBy?.(especieQuery);

    const especies = await especieQuery;

    response
      .json({
        metadata: {
          total: especies.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: especies.results.length,
        },
        records: especies.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request, response: Response, next: NextFunction) {
  try {
    const { especieId } = request.params;
    const especie = await Especie.query()
      .findOne('id', especieId);
    if (!especie) {
      throw new NotFoundError();
    }

    response
      .json(especie);

  } catch (error) {
    next(error);
  }
}

async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const especieCriada = await Especie.transaction(async transacting => {
      const especieValues = pick(request.body, [
        'nome',
        'familia_id',
        'genero_id',
        'autor_id',
        'ativo',
      ]);

      const especieConflitante = await Especie.query(transacting)
        .select('id')
        .where({
          familia_id: especieValues.familia_id,
          genero_id: especieValues.genero_id,
        })
        .findOne('nome', 'like', especieValues.nome);
      if (especieConflitante) {
        throw new ConflictError(600);
      }

      return Especie.query(transacting)
        .insertAndFetch(especieValues);
    });

    response.status(201)
      .json(especieCriada);
  } catch (error) {
    next(catchCallback(error));
  }
}

async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const especieAtualizada = await Especie.transaction(async transacting => {
      const { especieId } = request.params;
      const especieValues = pick(request.body, [
        'nome',
        'familia_id',
        'genero_id',
        'autor_id',
        'ativo',
      ]);

      const especie = await Especie.query(transacting)
        .select('id')
        .findOne('id', especieId);
      if (!especie) {
        throw new NotFoundError();
      }

      if (especieValues.nome) {
        const especieConflitante = await Especie.query(transacting)
          .select('id')
          .where({
            familia_id: especieValues.familia_id,
            genero_id: especieValues.genero_id,
          })
          .where('id', '!=', especieId)
          .findOne('nome', 'like', especieValues.nome);
        if (especieConflitante) {
          throw new ConflictError(600);
        }
      }

      return especie.$query(transacting)
        .updateAndFetch(especieValues);
    });

    response.status(200)
      .json(especieAtualizada);
  } catch (error) {
    next(catchCallback(error));
  }
}

async function remove(request: Request, response: Response, next: NextFunction) {
  try {
    await Especie.transaction(async transacting => {
      const { especieId } = request.params;

      const especie = await Especie.query(transacting)
        .select('id')
        .findOne({
          ativo: true,
          id: especieId,
        });
      if (!especie) {
        throw new NotFoundError();
      }

      await Especie.query(transacting)
        .where('id', '=', especieId)
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
