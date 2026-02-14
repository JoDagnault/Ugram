import { HttpError } from './error';

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(400, 'BAD_REQUEST', message);
    }
}
