
import express from 'express';
import morgan from 'morgan';
import http from 'http';
import dotenv from 'dotenv';
import v1 from './routes/v1/v1.mjs';
import { validator as v1Validator } from '~routes/v1/middleware/validator.mjs';
import { RequestValidationError } from './util/restError.mjs';
dotenv.config();

const app = express();
//app.use(v1Validator);

app.use(morgan('combined'));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/v1', v1);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Content-Security-Policy', 'default-src self')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization, X-PINGOTHER, X-File-Name, Cache-Control,X-Explorer-Storage,X-Explorer-Path');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// used to raise specific warnings in json response on e.g. bad requests
const ignoredErrors = [400];
app.use((err, req, res, next) => {
    if (err.errors) {
        err = new RequestValidationError(err.errors);
    }

    if (!err.statusCode) err.statusCode = 500;

    if (process.env.NODE_ENV == "development" && !ignoredErrors.includes(err.statusCode)) {
        console.warn(err);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        err
    });
});

http.createServer(app).listen(5000, '0.0.0.0', () => {
    console.log('Running on port', 5000);
});