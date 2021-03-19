import { BadRequestError } from '~util/restError.mjs';

export async function authenticateService(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        next(new BadRequestError('Authentication failed'));
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    const [username, password] = credentials.split(':');
    console.log("Client: " + username)


    if (process.env.ACCESS_TOKEN == password) {
        next();
    } else {
        next(new BadRequestError('Authentication failed'));
    }
}