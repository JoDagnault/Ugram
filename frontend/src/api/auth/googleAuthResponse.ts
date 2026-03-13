export interface GoogleLoginResponse {
    jwt: string;
    user: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    };
}
