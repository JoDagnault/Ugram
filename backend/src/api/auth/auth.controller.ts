import { LoginUsecase } from '../../application/auth/login.usecase';
import { NextFunction, Request, Response } from 'express';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { AuthValidator } from './assembler/auth-fields-validator';

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

            const result = await this.login.loginWithGoogle(idToken);
            return res.status(200).json(result);
        } catch (error: any) {
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
            return res.status(201).json(result);
        } catch (error: any) {
            next(error);
        }
    };
}
