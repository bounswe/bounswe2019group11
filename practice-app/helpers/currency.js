module.exports.getCurrentDateRounded = () => {
    const currentDate = new Date();
    // Get the YEAR-MONTH-DAY part and discard HOUR-MINUTE-SECOND-MILLIS
    const roundedDate = currentDate.toISOString().replace(/T.+/, '');
    return Date.parse(roundedDate);
};
