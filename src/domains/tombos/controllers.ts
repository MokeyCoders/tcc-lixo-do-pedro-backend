import { Request, Response, NextFunction } from 'express';

import NotFoundError from '~/errors/not-found-error';
import knex from '~/factories/knex';

import Tombo from './model';

async function findHeadMap(_: Request, response: Response, next: NextFunction) {
  try {
    const tomboQuery = Tombo.query()
      .select(['latitude', 'longitude'])
      .whereNot({
        latitude: null,
        longitude: null,
      });

    const tombos = await tomboQuery;
    const coordenadas = tombos.map(tombo => [tombo.longitude, tombo.latitude]);

    response
      .json(coordenadas);

  } catch (error) {
    next(error);
  }
}

async function findAllTombosWhitArea(request: Request, response: Response, next: NextFunction) {
  try {
    const {
      lat1,
      lgn1,
      lat2,
      lgn2,
      lat3,
      lgn3,
      lat4,
      lgn4,
    } = request.query;
    console.log(
      lat1,
      lgn1,
      lat2,
      lgn2,
      lat3,
      lgn3,
      lat4,
      lgn4,
    );

    // eslint-disable-next-line max-len
    const polygon = `POLYGON((${lat1} ${lgn1}, ${lat3} ${lgn3}, ${lat2} ${lgn2}, ${lat4} ${lgn4}, ${lat1} ${lgn1}))`;
    console.log(polygon);
    const tomboQuery = await knex('tombos')
      .select('hcf', 'latitude', 'longitude')
      .whereRaw('ST_Contains(ST_GeomFromText(?), POINT(latitude, longitude))', [polygon]);

    const tombos = await tomboQuery;
    const latLng = tombos.map(tombo => [tombo.latitude, tombo.longitude, tombo.hcf]);
    response
      .json(latLng);

  } catch (error) {
    next(error);

  }
}

async function find(request: Request, response: Response, next: NextFunction) {
  try {
    const pagination = request.pagination!;
    const tomboQuery = Tombo.query()
      // .modify('fetchList')
      .page(pagination.page, pagination.limit);

    request.filterBy?.(tomboQuery);
    request.orderBy?.(tomboQuery);

    const { local_coleta: localColeta } = request.query;
    if (localColeta) {
      const localColetaSubquery = knex
        .select('locais_coleta.id')
        .from('locais_coleta')
        .leftJoin('cidades', 'cidades.id', 'locais_coleta.cidade_id')
        .where('locais_coleta.id', knex.ref('tombos.local_coleta_id'))
        .where(orWhereQb => {
          orWhereQb.where('locais_coleta.descricao', 'like', `%${localColeta}%`)
            .orWhere('cidades.nome', 'like', `%${localColeta}%`);
        });
      tomboQuery.whereExists(localColetaSubquery);
    }

    const tombos = await tomboQuery;

    response
      .json({
        metadata: {
          total: tombos.total,
          page: pagination.page + 1,
          limit: pagination.limit,
          length: tombos.results.length,
        },
        records: tombos.results,
      });

  } catch (error) {
    next(error);
  }
}

async function findOne(request: Request<{ tomboId: string }>, response: Response, next: NextFunction) {
  try {
    const tombo = await Tombo.query()
      // .modify('fetchOne')
      .findOne({
        ativo: true,
        hcf: request.params.tomboId,
      });

    if (!tombo) {
      throw new NotFoundError();
    }

    response
      .json(tombo);

  } catch (error) {
    next(error);
  }
}

export default {
  heatMapCoordinates: findHeadMap,
  find,
  findOne,
  findAllTombosWhitArea,
};
