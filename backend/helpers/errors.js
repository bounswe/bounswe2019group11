function Error(name, message, cause) {
    return {
        name,
        message,
        cause
    }
}

module.exports = {
    USER_NOT_FOUND: (cause) => {
        return Error('UserNotFound', 'User not found for the request.', cause);
    },
    DATABASE_ERROR: (cause) => {
        return Error('DatabaseError', 'Database error occurred while processing the request.', cause);
    },
    VALIDATION_ERROR: (cause) => {
        return Error('ValidationError', 'Validation error.', cause);
    },
    INVALID_NAME: (cause) => {
        return Error('InvalidName', 'Name was missing or invalid.', cause);
    },
    INVALID_SURNAME: (cause) => {
        return Error('InvalidSurname', 'Surname was missing or invalid.', cause);
    },
    INVALID_EMAIL: (cause) => {
        return Error('InvalidEmail', 'Email was missing or invalid', cause);
    },
    INVALID_PASSWORD: (cause) => {
        return Error('InvalidPassword', 'Password was missing or invalid.', cause);
    },
    UNKNOWN_VALIDATION_ERROR: (cause) => {
        return Error('UnknownValidationError', 'Unknown validation error occurred.', cause);
    }
};
