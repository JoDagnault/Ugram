export class RevokedToken {
    constructor(
        readonly _token: string,
        readonly _expiresAt: Date,
    ) {}

    get token(): string {
        return this._token;
    }

    get expiresAt(): Date {
        return this._expiresAt;
    }
}
