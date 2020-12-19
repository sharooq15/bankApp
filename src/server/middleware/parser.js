import bodyParser from 'body-parser';

const rawBodyParser = (req, res, next) => {
  bodyParser.raw({
    limit: '50mb',
  })(req, res, next);
};

const jsonBodyParser = (req, res, next) => {
  bodyParser.json()(req, res, next);
};

const encodedBodyParser = (req, res, next) => {
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  })(req, res, next);
};

const errorHandler = (err, req, res) => {
  res.status(500).json({
    status: err.response.status,
    statusText: err.response.data.Message,
    details: err.response.data.MessageDetail,
  });
};

export {
  rawBodyParser,
  jsonBodyParser,
  encodedBodyParser,
  errorHandler,
};
