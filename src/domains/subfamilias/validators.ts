import Joi from '~/factories/joi';
import { changeValidationObject } from '~/helpers/validations';

const subfamiliaObject = {
  autor_id: Joi.databaseId(),
  familia_id: Joi.databaseId(),
  nome: Joi.string()
    .trim()
    .min(1)
    .max(300),
  ativo: Joi.boolean(),
};

const create = Joi
  .object(changeValidationObject(subfamiliaObject, ['familia_id', 'nome']));

const update = Joi.object(changeValidationObject(subfamiliaObject))
  .min(1);

export default {
  create,
  update,
};
