import HttpError from './http-error';

class ForbiddenError extends HttpError {

  constructor(errorCode: number = 30, message?: string) {
    super(403, errorCode, undefined, message);
  }

}

export default ForbiddenError;
