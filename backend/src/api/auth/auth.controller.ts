import { LoginUsecase } from '../../application/auth/login.usecase';
import { NextFunction, Request, Response } from 'express';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { AuthValidator } from './assembler/auth-fields-validator';
import { LogoutUsecase } from '../../application/auth/logout.usecase';
import { AuthAssembler } from './assembler/auth.assembler';
import { RevokedToken } from '../../domain/auth/token';
import { AuthResponse } from '../../types/auth.types';
import { logger } from '../../logger';

export class AuthController {
    constructor(
        private readonly login: LoginUsecase,
        private readonly register: RegisterUsecase,
        private readonly logout: LogoutUsecase,
        private readonly assembler: AuthAssembler,
    ) {}

    loginToAccount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            AuthValidator.validateLogin(req.body);
            const { idToken } = req.body;

            const result: AuthResponse =
                await this.login.loginWithGoogle(idToken);
            logger.info('User logged in', { userId: result.user.id });
            return res.status(200).json(result);
        } catch (error: any) {
            logger.warn('Login failed', { error: error.message });
            next(error);
        }
    };

    registerAccount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            AuthValidator.validateRegister(req.body);
            const { idToken, username, firstName, lastName, phoneNumber } =
                req.body;

            const result = await this.register.registerWithGoogle(
                idToken,
                username,
                firstName,
                lastName,
                phoneNumber,
            );
            logger.info('User registered', {
                userId: result.user.id,
                username,
            });
            return res.status(201).json(result);
        } catch (error: any) {
            logger.warn('Registration failed', { error: error.message });
            next(error);
        }
    };

    logoutAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idToken: string = req.headers.authorization?.split(' ')[1]!;
            AuthValidator.validateIdToken(idToken);
            const revokedToken: RevokedToken =
                this.assembler.toRevokedToken(idToken);

            await this.logout.logout(revokedToken);
            logger.info('User logged out');
            return res.status(200).send();
        } catch (error: any) {
            logger.warn('Logout Failed', { error: error.message });
            next(error);
        }
    };
}
