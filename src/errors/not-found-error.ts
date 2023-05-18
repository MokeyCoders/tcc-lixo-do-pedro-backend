import HttpError from './http-error';

class NotFoundError extends HttpError {

  constructor(errorCode: number = 11) {
    super(404, errorCode);
  }

}

export default NotFoundError;
