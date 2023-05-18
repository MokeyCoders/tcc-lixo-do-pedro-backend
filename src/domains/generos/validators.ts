import Joi from '~/factories/joi';
import { changeValidationObject } from '~/helpers/validations';

const generoObject = {
  familia_id: Joi.databaseId(),
  nome: Joi.string()
    .trim()
    .min(1)
    .max(200),
  ativo: Joi.boolean(),
};

const create = Joi
  .object(changeValidationObject(generoObject, ['familia_id', 'nome']));

const update = Joi.object(changeValidationObject(generoObject))
  .min(1);

export default {
  create,
  update,
};
