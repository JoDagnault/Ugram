import { LoginUsecase } from '../../application/auth/login.usecase';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.router';
import { RevokedTokenRepository } from '../../domain/auth/revoked-token.repository';
import { UserRepository } from '../../domain/users/user.repository';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { GoogleAuthService } from '../../application/auth/google.auth.service';
import { LogoutUsecase } from '../../application/auth/logout.usecase';
import { AuthAssembler } from './assembler/auth.assembler';

export function AuthModule(
    userRepository: UserRepository,
    revokedTokenRepository: RevokedTokenRepository,
) {
    const googleAuthService: GoogleAuthService = new GoogleAuthService();

    const loginUsecase = new LoginUsecase(userRepository, googleAuthService);
    const registerUsecase = new RegisterUsecase(
        userRepository,
        googleAuthService,
    );
    const logoutUsecase = new LogoutUsecase(revokedTokenRepository);

    const authController = new AuthController(
        loginUsecase,
        registerUsecase,
        logoutUsecase,
        new AuthAssembler(),
    );
    const authRouter = new AuthRouter(authController);

    return { authRouter: authRouter.router };
}
