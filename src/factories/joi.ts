import BaseJoi, {
  Extension, NumberSchema, Root, StringSchema,
} from 'joi';

interface ExtendedJoi extends Root {
  databaseId(): NumberSchema;
  cpf(): StringSchema;
  cnpj(): StringSchema;
}

const extensions: Extension[] = [
  {
    type: 'databaseId',
    base: BaseJoi.number()
      .integer()
      .min(1),
  },
  {
    type: 'rg',
    base: BaseJoi.string()
      .max(11)
      .replace(/[^0-9]+/, ''),
    messages: {
      'rg.invalid': '"{{#label}}" is not a valid rg number',
    },

    validate(value) {
      return { value };
    },
  },
  {
    type: 'cpf',
    base: BaseJoi.string()
      .max(14)
      .replace(/[^0-9]+/g, ''),
    messages: {
      'cpf.invalid': '"{{#label}}" is not a valid cpf number',
    },
    validate(value, helpers) {
      const BLACKLIST = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        '12345678909',
      ];

      if (BLACKLIST.includes(value)) {
        return {
          errors: helpers.error('cpf.invalid', { value }),
        };
      }

      return { value };
    },
  },
  {
    type: 'cnpj',
    base: BaseJoi.string()
      .max(18)
      .replace(/[^0-9]+/, ''),
    messages: {
      'cnpj.invalid': '"{{#label}}" is not a valid cnpj number',
    },
    validate(value, helpers) {
      const BLACKLIST = [
        '00000000000000',
        '11111111111111',
        '22222222222222',
        '33333333333333',
        '44444444444444',
        '55555555555555',
        '66666666666666',
        '77777777777777',
        '88888888888888',
        '99999999999999',
      ];

      if (BLACKLIST.includes(value)) {
        return {
          errors: helpers.error('cnpj.invalid', { value }),
        };
      }

      return { value };
    },
  },
  {
    type: 'customValidate',
    messages: {
      'json.invalid': '"{{#label}}" must be a valid json',
    },
    rules: {
      json: {
        method() {
          return this.$_addRule('json');
        },
        validate(value, helpers) {
          try {
            if (typeof value === 'string') {
              return JSON.parse(value);
            }
            if (Array.isArray(value)) {
              return value.map(v => JSON.parse(v));
            }
          } catch (ex) { /**/ }

          return helpers.error('json.invalid', { value });
        },
      },
    },
  },
];

const Joi: ExtendedJoi = BaseJoi.extend(...extensions);

export default Joi;
