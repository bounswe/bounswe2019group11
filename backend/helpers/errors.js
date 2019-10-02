function Error(errorCode, errorMessage, cause) {
    return {
        errorCode,
        errorMessage,
        cause
    }
}

module.exports = {
    USER_NOT_FOUND: (cause) => {
        return Error(1, "User not found.", cause)
    },
    DATABASE_ERROR: (cause) => {
        return Error(2, "Database error.", cause)
    }
};
