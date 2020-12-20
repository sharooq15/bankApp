const internalServerError = {
  errorMessage: 'The server has encountered a situation it doesn\'t know how to handle',
  errorType: 'Internal Server Error',
  errorCode: 500,
};

const forbidden = {
  errorMessage: 'You are forbidden from accessing this api',
  errorType: 'Forbidden',
  errorCode: 403,
};

const unauthorized = {
  errorMessage: 'You are unauthorized to make this call',
  errorType: 'Unauthorized',
  errorCode: 401,
};

export {
  internalServerError,
  forbidden,
  unauthorized,
};
