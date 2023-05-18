import { ForbiddenError as AbilityForbiddenError } from '@casl/ability';
import { Request, Response, NextFunction } from 'express';

import HttpError from '~/errors/http-error';
import { detectSubjectType } from '~/helpers/ability';
import errorCodes from '~/resources/error-codes';

function handleHttpError(error: HttpError, response: Response) {
  const { errorCode } = error;
  const errorMessage = error.message || errorCodes[errorCode];

  response
    .status(error.statusCode)
    .json({
      error: {
        name: error.name,
        code: errorCode,
        message: errorMessage,
        report: error.report,
      },
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorMiddleware(error: Error, _request: Request, response: Response, _next: NextFunction) {
  console.error(error); // eslint-disable-line no-console

  if (error instanceof HttpError) {
    handleHttpError(error, response);
    return;
  }

  if (error instanceof AbilityForbiddenError) {
    const message = `You are not allowed to '${error.action}' on '${detectSubjectType(error.subject)}'`;
    handleHttpError(new HttpError(403, 30, undefined, message), response);
    return;
  }

  response
    .status(500)
    .json({
      error: {
        code: 0,
        message: 'Internal Server Error',
      },
    });
}

export default errorMiddleware;
