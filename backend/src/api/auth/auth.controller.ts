import { LoginUsecase } from '../../application/auth/login.usecase';
import { NextFunction, Request, Response } from 'express';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { AuthValidator } from './assembler/auth-fields-validator';
import { logger } from '../../logger';
import { AuthResponse } from '../../types/auth.types';

export class AuthController {
    constructor(
        private readonly login: LoginUsecase,
        private readonly register: RegisterUsecase,
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
}
