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
    INTERNAL_ERROR: (cause) => {
        return Error('InternalError', 'Internal error occurred while processing the request.', cause);
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
    },
    EMAIL_IN_USE: (cause) => {
      return Error('EmailInUse', 'Email is associated with an existing user.', cause);
    },
    INVALID_CREDENTIALS: (cause) => {
      return Error('InvalidCredentials', 'Email or the password is invalid.', cause);
    },
    INVALID_VERIFICATION_TOKEN: (cause) => {
      return Error('InvalidVerificationToken', 'Verification token cannot be found or expired.', cause);
    },
    USER_ALREADY_VERIFIED: (cause) => {
      return Error('UserAlreadyVerified', 'User already verified', cause);
    },
};
