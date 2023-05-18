import { Request, Response, NextFunction } from 'express';

import appConfig from '~/config/app';
import {
  Filter, filterBy, Order, orderBy,
} from '~/helpers/request-query';

async function queriesMiddleware(request: Request, _: Response, next: NextFunction) {
  const { query } = request;

  let page = parseInt(query.page as string);
  const isValidPageValue = typeof page === 'number' && page > 0;

  if (!isValidPageValue) {
    page = 0;
  } else {
    // Objection ORM first page starts at 0
    page -= 1;
  }

  let limit = parseInt(query.limit as string);
  const isValidLimitValue = typeof limit === 'number' && limit > 0 && limit <= 10000;

  if (!isValidLimitValue) {
    limit = appConfig.pagination.limit;
  }

  request.pagination = {
    page,
    limit,
  };

  try {
    const filtersRequestQuery = query.filters;
    let filters: Filter[];
    if (Array.isArray(filtersRequestQuery)) {
      filters = filtersRequestQuery.map(item => {
        return typeof item === 'string' ? JSON.parse(item) : item;
      });
    } else if (typeof filtersRequestQuery === 'string') {
      filters = JSON.parse(filtersRequestQuery);
    } else {
      filters = [];
    }

    request.filterBy = filterBy(filters);
  } catch (error) {
    console.warn('Failed while parsing filters object', error);
  }

  try {
    const ordersRequestQuery = query.orders;
    let orders: Order[];
    if (Array.isArray(ordersRequestQuery)) {
      orders = ordersRequestQuery.map(item => {
        return typeof item === 'string' ? JSON.parse(item) : item;
      });

    } else if (typeof ordersRequestQuery === 'string') {
      orders = JSON.parse(ordersRequestQuery);
    } else {
      orders = [];
    }

    request.orderBy = orderBy(orders);

  } catch (error) {
    console.warn('Failed while parsing orders object', error);
  }

  next();
}

export default queriesMiddleware;
