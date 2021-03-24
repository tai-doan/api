const RESULT_CODE = {
    SUCCESS: 1,
    ERROR: -1,
    DATA_EXIST: -2
};

const RESULT_MESSAGE = {
    PERMISSION: 'You do not have permission',
    DATA_EXISTS: 'Data exists',
    SUCCESS: 'Processed successfully',
    ERROR: 'Processed error'
};

module.exports = {
    RESULT_CODE,
    RESULT_MESSAGE
};
