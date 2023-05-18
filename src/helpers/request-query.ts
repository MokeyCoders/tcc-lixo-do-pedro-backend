import { Knex } from 'knex';

import appConfig from '~/config/app';

type WhereTuple = [string, string, any];
type WhereObject = { orWhere: WhereTuple[] };
type OperatorFunction = (column: string, value: any) => [string, string, any];
export type Filter = WhereObject | WhereTuple;

type OrderTuple = [string, string];
export type Order = OrderTuple;

const operatorsMap: Record<string, string | OperatorFunction> = {
  eq: '=',
  ne: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  in: 'in',
  contains(column: string, value: any) {
    return [column, 'like', `%${value}%`];
  },
};

const validSortAscendValues = ['asc', 'ascend'];
const validSortDescendValues = ['desc', 'descend'];
const validSortDirections = [...validSortAscendValues, ...validSortDescendValues];

function translateCondition(condition: WhereTuple): [string, string, any] | null {
  const [column, operator, value] = condition;
  const operatorValue = operatorsMap[operator];
  if (!operatorValue) {
    return null;
  }

  if (typeof operatorValue === 'function') {
    return operatorValue(column, value);
  }
  return [column, operatorValue, value];
}

export function filterBy(filters?: Filter[]) {
  return (builder: Knex.QueryInterface) => {
    if (!filters?.length) {
      return builder;
    }

    filters.forEach(conditionOrObject => {
      if (Array.isArray(conditionOrObject)) {
        const result = translateCondition(conditionOrObject);
        if (result) {
          builder.where(...result);
        }
      } else if (conditionOrObject.orWhere) {
        builder.where(whereQb => {
          conditionOrObject.orWhere
            .forEach(condition => {
              const result = translateCondition(condition);
              if (result) {
                whereQb.where(...result);
              }
            });
        });
      }
    });

    return builder;
  };
}

export function orderBy(orders?: Order[]) {
  return (builder: Knex.QueryInterface) => {
    if (!orders?.length) {
      return;
    }

    orders.forEach(item => {
      const [column, direction] = item;
      if (validSortDirections.includes(direction)) {
        const order = validSortAscendValues.includes(direction.toLowerCase()) ? 'asc' : 'desc';
        builder.orderBy(column, order);
      }
    });
  };
}

export function calculatePaginationAttributes(page?: number, limit?: number) {
  let sanitizedPage = 1;
  if (typeof page === 'number' && page > 0) {
    sanitizedPage = page;
  }

  let sanitizedLimit = appConfig.pagination.limit;
  if (typeof limit === 'number' && limit > 0) {
    sanitizedLimit = limit;
  }

  const offset = (sanitizedPage - 1) * sanitizedLimit;

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    offset,
  };
}
