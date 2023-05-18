import Joi from '~/factories/joi';

const login = Joi.object({
  captcha_token: Joi.string()
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .max(200)
    .required(),
  senha: Joi.string()
    .min(6)
    .max(200)
    .required(),
});

export default {
  login,
};
