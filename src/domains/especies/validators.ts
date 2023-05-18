import Joi from '~/factories/joi';
import { changeValidationObject } from '~/helpers/validations';

const especieObject = {
  nome: Joi.string()
    .trim()
    .min(1)
    .max(200),
  familia_id: Joi.databaseId(),
  genero_id: Joi.databaseId(),
  autor_id: Joi.databaseId(),
  ativo: Joi.boolean(),
};

const create = Joi
  .object(changeValidationObject(especieObject, ['nome', 'familia_id', 'genero_id']));

const update = Joi.object(changeValidationObject(especieObject))
  .min(1);

export default {
  create,
  update,
};
