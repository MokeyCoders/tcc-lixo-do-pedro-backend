import { createTransport, SendMailOptions } from 'nodemailer';

import config from '~/config/emails';

const transport = createTransport({
  host: config.host,
  port: config.port,
  secure: config.isSecure,
  auth: {
    user: config.noReply.username,
    pass: config.noReply.password,
  },
});

async function send(options: SendMailOptions) {
  const {
    to, subject, text, html,
  } = options;

  return transport.sendMail({
    from: config.noReply.from,
    to,
    subject,
    text,
    html,
  });
}

export default {
  send,
};
