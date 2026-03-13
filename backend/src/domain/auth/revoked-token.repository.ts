import { RevokedToken } from './token';

export interface RevokedTokenRepository {
    add(revokedToken: RevokedToken): Promise<void>;
    exists(token: string): Promise<boolean>;
}
