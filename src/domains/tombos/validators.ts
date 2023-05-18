import Joi from '~/factories/joi';

const findQueryParams = Joi.object({
  local_coleta: Joi.string()
    .trim()
    .min(1)
    .max(2000),
});

export default {
  findQueryParams,
};
