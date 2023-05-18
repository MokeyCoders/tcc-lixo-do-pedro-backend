import Joi from 'joi';

import defaultConfig from '~/config/validation';
import UnprocessableEntityError from '~/errors/unprocessable-entity-error';

export function validateSchema(schema: Joi.Schema, data: any, config?: object) {
  const { error, value } = schema.validate(data, { ...defaultConfig, ...config });

  if (!error) {
    return value;
  }

  const report = error.details.map(detail => {
    const key = detail.path.join('.');
    const message = detail.message.replace(/['"]/g, '');

    return { [key]: message };
  });

  throw new UnprocessableEntityError(40, report);
}

export function requiredWhen(condition: boolean) {
  return condition ? 'required' : 'optional';
}

export function forbiddenWhen(condition: boolean) {
  return condition ? 'forbidden' : 'optional';
}

export function changeValidationObject(schemaObject: object, required?: string[], exclude?: string[]) {
  return Object.entries(schemaObject)
    .reduce((object, entry) => {
      const [key, schema] = entry;

      if (exclude?.includes(key)) {
        return object;
      }

      let presence = 'optional';
      if (required?.includes(key)) {
        presence = 'required';
      }

      return {
        ...object,
        [key]: schema.presence(presence),
      };
    }, {});
}

export default {};
