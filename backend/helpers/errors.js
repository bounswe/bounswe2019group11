function PapelError(name, message, cause) {
    return {
        name,
        message,
        cause
    }
}

module.exports = {
    USER_NOT_FOUND: (cause) => {
        return PapelError('UserNotFound', 'User not found for the request.', cause);
    },
    INTERNAL_ERROR: (cause) => {
        return PapelError('InternalError', 'Internal error occurred while processing the request.', cause);
    },
    VALIDATION_ERROR: (cause) => {
        return PapelError('ValidationError', 'Validation error.', cause);
    },
    INVALID_NAME: (cause) => {
        return PapelError('InvalidName', 'Name was missing or invalid.', cause);
    },
    INVALID_SURNAME: (cause) => {
        return PapelError('InvalidSurname', 'Surname was missing or invalid.', cause);
    },
    INVALID_EMAIL: (cause) => {
        return PapelError('InvalidEmail', 'Email was missing or invalid', cause);
    },
    INVALID_PASSWORD: (cause) => {
        return PapelError('InvalidPassword', 'Password was missing or invalid.', cause);
    },
    UNKNOWN_VALIDATION_ERROR: (cause) => {
        return PapelError('UnknownValidationError', 'Unknown validation error occurred.', cause);
    },
    EMAIL_IN_USE: (cause) => {
      return PapelError('EmailInUse', 'Email is associated with an existing user.', cause);
    },
    INVALID_CREDENTIALS: (cause) => {
      return PapelError('InvalidCredentials', 'Email or the password is invalid.', cause);
    },
    INVALID_VERIFICATION_TOKEN: (cause) => {
      return PapelError('InvalidVerificationToken', 'Verification token cannot be found or expired.', cause);
    },
    USER_ALREADY_VERIFIED: (cause) => {
      return PapelError('UserAlreadyVerified', 'User already verified', cause);
    },
};
