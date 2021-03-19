class RestError extends Error {
    constructor(message, statusCode, type) {
        super(message);

        this.statusCode = statusCode;
        this.type = type;
    }
}

class BadRequestError extends RestError {
    constructor(message, type) {
        super(message, 401, type);
    }
}

class RequestValidationError extends BadRequestError {
    constructor(errors) {
        super('Invalid request format', 'validation');

        this.errors = errors;
    }
}

export { RestError, BadRequestError, RequestValidationError };