import openApiValidator from 'express-openapi-validator';


export const validator = openApiValidator.middleware({
    apiSpec: './apispec.yaml',
    validateRequests: true,
})