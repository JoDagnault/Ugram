import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Ugram API', version: '1.0.0' },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        path.resolve(__dirname, '../api/**/*.router.ts'),
        path.resolve(__dirname, '../api/**/*.router.js'),
    ],
};

export const swaggerSpec = swaggerJsdoc(options);
