class UserNotAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class UserDoesntExistError extends Error {
    constructor() {
        super("User does not exist.");
        this.name = this.constructor.name;
    }
}

class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class AdminRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
