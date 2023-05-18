import HttpError from './http-error';

class ConflictError extends HttpError {

  constructor(errorCode: number, report?: any) {
    super(409, errorCode, report);
  }

}

export default ConflictError;
