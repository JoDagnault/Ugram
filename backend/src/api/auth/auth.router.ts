/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in to a user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token returned by the client sign-in flow.
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /auth/register:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken, username, firstName, lastName, phoneNumber]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token returned by the client sign-in flow.
 *                 example: eyJhbGciOi...
 *               username:
 *                 type: string
 *                 description: Public handle. Maximum 30 characters, no spaces.
 *                 example: alex_photo
 *               firstName:
 *                 type: string
 *                 description: User first name. Letters, spaces, and hyphens only.
 *                 example: Alex
 *               lastName:
 *                 type: string
 *                 description: User last name. Letters, spaces, and hyphens only.
 *                 example: Morgan
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number in `xxx-xxx-xxxx` format.
 *                 example: 418-555-1234
 *     responses:
 *       201:
 *         description: Account created successfully
 *       409:
 *         description: Email address or username is already in use
 *
 * /auth/logout:
 *   post:
 *     summary: Log out of the user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
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
        this.router.post('/logout', this.authController.logoutAccount);
    }
}
