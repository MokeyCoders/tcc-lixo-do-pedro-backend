import HttpError from './http-error';

class UnprocessableEntityError extends HttpError {

  constructor(errorCode: number = 40, report?: any) {
    super(422, errorCode, report);
  }

}

export default UnprocessableEntityError;
