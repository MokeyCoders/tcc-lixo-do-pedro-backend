import HttpError from './http-error';

class UnauthorizedError extends HttpError {

  constructor(errorCode: number = 20) {
    super(401, errorCode);
  }

}

export default UnauthorizedError;
