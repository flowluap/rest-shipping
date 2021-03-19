import bcrypt from 'bcryptjs';
import { BadRequestError } from '@util/restError.mjs';

export async function authenticateService(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        next(new BadRequestError('Authentication failed'));
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    const [username, password] = credentials.split(':');

    const [service] = await db.query('SELECT * from service where name=?', [username]);

    if (service[0] && bcrypt.compareSync(password, service[0].hash)) {
        req.user = {};
        req.shop = {};
        req.user.id = req.headers['userid'];
        req.shop.id = req.headers['shopid'];
        next();
    } else {
        next(new BadRequestError('Authentication failed'));
    }
}