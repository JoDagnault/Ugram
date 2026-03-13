import { LoginUsecase } from '../../application/auth/login.usecase';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.router';
import { UserRepository } from '../../domain/users/user.repository';
import { RegisterUsecase } from '../../application/auth/register.usecase';
import { GoogleAuthService } from '../../application/auth/google.auth.service';
import { LogoutUsecase } from '../../application/auth/logout.usecase';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { PrismaRevokedTokenRepository } from '../../infrastructure/auth/revoked-token.repository.prisma';
import { InMemoryRevokedTokenRepository } from '../../infrastructure/auth/revoked-token.repository.memory';
import { AuthAssembler } from './assembler/auth.assembler';

export function AuthModule(userRepository: UserRepository) {
    const googleAuthService: GoogleAuthService = new GoogleAuthService();
    const isDev =
        process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const revokedTokenRepository =
        process.env.NODE_ENV === 'test' || isDev
            ? new InMemoryRevokedTokenRepository()
            : new PrismaRevokedTokenRepository(getPrismaClient());

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

    return { authRouter: authRouter.router, revokedTokenRepository };
}
