import bodyParser from 'body-parser';
import authenticateJWT from './auth';

function rawBodyParser(req, res, next) {
  bodyParser.raw({
    limit: '50mb',
  })(req, res, next);
}

function jsonBodyParser(req, res, next) {
  bodyParser.json()(req, res, next);
}

function encodedBodyParser(req, res, next) {
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  })(req, res, next);
}

function errorHandler(err, req, res) {
  res.status(500).json({
    status: err.response.status,
    statusText: err.response.data.Message,
    details: err.response.data.MessageDetail,
  });
}

export {
  authenticateJWT,
  errorHandler,
  encodedBodyParser,
  jsonBodyParser,
  rawBodyParser,
};
