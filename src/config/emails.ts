const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,

  EMAIL_NOREPLY_FROM,
  EMAIL_NOREPLY_USER,
  EMAIL_NOREPLY_PASS,
} = process.env;

const emailConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  isSecure: SMTP_SECURE === 'true',

  noReply: {
    from: EMAIL_NOREPLY_FROM,
    username: EMAIL_NOREPLY_USER,
    password: EMAIL_NOREPLY_PASS,
  },
};

export default emailConfig;
