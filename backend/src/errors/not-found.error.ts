import { HttpError } from './error';

export class NotFoundError extends HttpError {
    constructor(message = 'Not found') {
        super(404, 'NOT_FOUND', message);
    }
}
