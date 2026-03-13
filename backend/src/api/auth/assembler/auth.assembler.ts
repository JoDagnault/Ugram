import jwt, { JwtPayload } from 'jsonwebtoken';
import { RevokedToken } from '../../../domain/auth/token';
import { BadRequestError } from '../../../errors/bad-request.error';

export class AuthAssembler {
    toRevokedToken(idToken: string): RevokedToken {
        try {
            const decoded = jwt.verify(
                idToken,
                process.env.JWT_SECRET!,
            ) as JwtPayload;

            if (!decoded.exp) {
                throw new BadRequestError('Token missing expiration');
            }

            return new RevokedToken(idToken, new Date(decoded.exp * 1000));
        } catch (error) {
            if (error instanceof BadRequestError) throw error;
            throw new BadRequestError('Invalid or expired token');
        }
    }
}
