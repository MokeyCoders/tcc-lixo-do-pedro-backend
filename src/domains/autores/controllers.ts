import { Request, Response, NextFunction } from 'express';
import pick from 'lodash.pick';

import ConflictError from '~/errors/conflict-error';
import NotFoundError from '~/errors/not-found-error';

import Autor from './model';

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const autorQuery = Autor.query()
      .page(pagination.page, pagination.limit);

    request.filterBy?.(autorQuery);
    request.orderBy?.(autorQuery);

    const autores = await autorQuery;

    response
      .json({
        metadata: {
          total: autores.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: autores.results.length,
        },
        records: autores.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request, response: Response, next: NextFunction) {
  try {
    const { autorId } = request.params;
    const autor = await Autor.query()
      .findOne('id', autorId);
    if (!autor) {
      throw new NotFoundError();
    }

    response
      .json(autor);

  } catch (error) {
    next(error);
  }
}

async function create(request: Request, response: Response, next: NextFunction) {
  try {
    const autorCriado = await Autor.transaction(async transacting => {
      const autorValues = pick(request.body, [
        'nome',
        'iniciais',
        'ativo',
      ]);

      const autor = await Autor.query(transacting)
        .select('id')
        .findOne('nome', 'like', autorValues.nome);
      if (autor) {
        throw new ConflictError(500);
      }

      return Autor.query(transacting)
        .insertAndFetch(autorValues);
    });

    response.status(201)
      .json(autorCriado);
  } catch (error) {
    next(error);
  }
}

async function update(request: Request, response: Response, next: NextFunction) {
  try {
    const autorAtualizado = await Autor.transaction(async transacting => {
      const { autorId } = request.params;
      const autorValues = pick(request.body, [
        'nome',
        'iniciais',
        'ativo',
      ]);

      const autor = await Autor.query(transacting)
        .select('id')
        .findOne('id', autorId);
      if (!autor) {
        throw new NotFoundError();
      }

      if (autorValues.nome) {
        const autorConflitante = await Autor.query(transacting)
          .select('id')
          .where('id', '!=', autorId)
          .findOne('nome', 'like', autorValues.nome);
        if (autorConflitante) {
          throw new ConflictError(500);
        }
      }

      return autor.$query(transacting)
        .updateAndFetch(autorValues);
    });

    response.status(200)
      .json(autorAtualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(request: Request, response: Response, next: NextFunction) {
  try {
    await Autor.transaction(async transacting => {
      const { autorId } = request.params;

      const autor = await Autor.query(transacting)
        .select('id')
        .findOne({
          ativo: true,
          id: autorId,
        });
      if (!autor) {
        throw new NotFoundError();
      }

      await Autor.query(transacting)
        .where('id', '=', autorId)
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
