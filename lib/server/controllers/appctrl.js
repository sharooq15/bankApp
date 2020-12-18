'use strict';

export function isAlive (req, res) {
  res.status(200).json('This is simple page');
}

export function notFound (req, res) {
  res.redirect('/error/404');
}
