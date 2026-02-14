import { HttpError } from './error';

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(403, 'FORBIDDEN', message);
    }
}
