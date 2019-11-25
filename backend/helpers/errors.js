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
        return PapelError('InvalidCredentials', 'Email, password or the Google id is invalid.', cause);
    },
    INVALID_VERIFICATION_TOKEN: (cause) => {
        return PapelError('InvalidVerificationToken', 'Verification token cannot be found or expired.', cause);
    },
    USER_ALREADY_VERIFIED: (cause) => {
        return PapelError('UserAlreadyVerified', 'User already verified', cause);
    },
    USER_NOT_VERIFIED: (cause) => {
        return PapelError('UserNotVerified', 'User not verified.', cause);
    },
    INVALID_LATITUDE: (cause) => {
        return PapelError('InvalidLatitude', 'Invalid or missing latitude for the location.', cause);
    },
    INVALID_LONGITUDE: (cause) => {
        return PapelError('InvalidLongitude', 'Invalid or missing longitude for the location.', cause);
    },
    INVALID_ID_NUMBER: (cause) => {
        return PapelError('InvalidIdNumber', 'Invalid Id number.', cause);
    },
    INVALID_IBAN: (cause) => {
        return PapelError('InvalidIban', 'Invalid IBAN.', cause);
    },
    INVALID_LOST_PASSWORD_TOKEN: (cause) => {
        return PapelError('InvalidLostPasswordToken', 'Lost password token cannot be found or expired.', cause);
    },
    STOCK_NOT_FOUND: (cause) => {
        return PapelError('StockNotFound', 'Stock not found.', cause);
    },
    CURRENCY_NOT_FOUND: (cause) => {
        return PapelError('CurrencyNotFound', 'Currency not found.', cause);
    },
    ARTICLE_NOT_FOUND: (cause) => {
      return PapelError('ArticleNotFound', 'Article with the given id is not found.', cause);
    },
    MISSING_TOKEN: (cause) => {
      return PapelError('MissingToken', 'Authorization token not found.', cause);
    },
    INVALID_TOKEN: (cause) => {
      return PapelError('InvalidToken', 'Authorization token is invalid.', cause);
    },
    EXPIRED_TOKEN: (cause) => {
      return PapelError('ExpiredToken', 'Authorization token is expired.', cause);
    },
    INVALID_TITLE: (cause) => {
      return PapelError('InvalidTitle', 'Title was missing.', cause);
    },
    INVALID_BODY: (cause) => {
      return PapelError('InvalidBody', 'Body was missing.', cause);
    },
    COMMENT_NOT_FOUND: (cause) => {
        return PapelError('CommentNotFound', 'Comment not found.', cause);
    },
    VOTE_NOT_FOUND: (cause) => {
        return PapelError('VoteNotFound', 'Vote for the given article or the user id not found.', cause);
    },
    INVALID_CURRENCY_CODE: (cause) => {
        return PapelError('InvalidCurrencyCode', 'Given currency code is not valid.', cause);
    },
};
