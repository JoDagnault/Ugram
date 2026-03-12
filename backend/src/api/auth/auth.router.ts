import { AuthController } from './auth.controller';
import { Router } from 'express';

export class AuthRouter {
    public router: Router;

    constructor(private authController: AuthController) {
        this.router = Router();
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post('/login', this.authController.loginToAccount);
        this.router.post('/register', this.authController.registerAccount);
    }
}
