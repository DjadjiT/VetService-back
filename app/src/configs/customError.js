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

class HRExistError extends Error {
    constructor() {
        super("Record does not exist.");
        this.name = this.constructor.name;
    }
}

class HRError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class AppointmentError extends Error {
    constructor(message) {
        super(message);
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

class NewsletterError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NewsletterDoesntExistError extends Error {
    constructor() {
        super("Newsletter doesnt exist");
        this.name = this.constructor.name;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class OrderError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class OrderDoesntExistError extends Error {
    constructor() {
        super("Order doesnt exist");
        this.name = this.constructor.name;
    }
}

module.exports = {
    UserNotAuthorizedError,
    UserDoesntExistError,
    UserError,
    AuthError,
    AdminRequestError,
    ValidationError,
    HRExistError,
    AppointmentError,
    NewsletterError,
    NewsletterDoesntExistError,
    HRError,
    OrderDoesntExistError,
    OrderError
};
