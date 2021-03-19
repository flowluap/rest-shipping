import openApiValidator from 'express-openapi-validator';


export const validator = openApiValidator.middleware({
    apiSpec: './src/routes/v1/middleware/apispec.yaml',
    validateRequests: true,
})