'use strict';

import bodyParser from 'body-parser';

export function redirect (req, res) {
  res.redirect('/');
};

export function rawBodyParser (req, res, next) {
  bodyParser.raw({
    limit: '50mb'
  })(req, res, next);
}

export function jsonBodyParser (req, res, next) {
  bodyParser.json()(req, res, next);
}

export function encodedBodyParser (req, res, next) {
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })(req, res, next);
}

export function errorHandler (err, req, res, next) {
  res.status(500).json({
    status: err.response.status,
    statusText: err.response.data.Message,
    details: err.response.data.MessageDetail
  });
}
