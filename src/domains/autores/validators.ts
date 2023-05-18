import Joi from '~/factories/joi';
import { changeValidationObject } from '~/helpers/validations';

const autorObject = {
  nome: Joi.string()
    .trim()
    .min(1)
    .max(200),
  iniciais: Joi.string()
    .trim()
    .min(1)
    .max(200),
  ativo: Joi.boolean(),
};

const create = Joi
  .object(changeValidationObject(autorObject, ['nome']));

const update = Joi.object(changeValidationObject(autorObject))
  .min(1);

export default {
  create,
  update,
};
