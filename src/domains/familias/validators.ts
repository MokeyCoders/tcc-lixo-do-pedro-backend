import Joi from '~/factories/joi';
import { changeValidationObject } from '~/helpers/validations';

const familiaObject = {
  nome: Joi.string()
    .trim()
    .min(1)
    .max(200),
  ativo: Joi.boolean(),
};

const create = Joi
  .object(changeValidationObject(familiaObject, ['nome']));

const update = Joi.object(changeValidationObject(familiaObject))
  .min(1);

export default {
  create,
  update,
};
