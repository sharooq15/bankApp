import jwt from 'jsonwebtoken';
import {
  accessTokenSecret,
} from '../../common';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.send(401);
  }
};

export {
  authenticateJWT,
};
