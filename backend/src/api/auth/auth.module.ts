import { LoginUsecase } from '../../application/auth/login.usecase';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.router';
import { UserRepository } from '../../domain/users/user.repository';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { GoogleAuthService } from '../../application/auth/google.auth.service';

export function AuthModule(userRepository: UserRepository) {
    const googleAuthService: GoogleAuthService = new GoogleAuthService();

    const loginUsecase = new LoginUsecase(userRepository, googleAuthService);
    const registerUsecase = new RegisterUsecase(
        userRepository,
        googleAuthService,
    );

    const authController = new AuthController(loginUsecase, registerUsecase);
    const authRouter = new AuthRouter(authController);

    return { authRouter: authRouter.router };
}
