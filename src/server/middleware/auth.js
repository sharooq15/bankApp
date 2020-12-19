import njwt from 'njwt';
import {
  getTokenFromAuthHeader,
} from '../../api-utils';
import {
  accessTokenSecret,
} from '../../common';

const authenticateJWT = async (req, res, next) => {
  const {
    headers: {
      authorization: authHeader,
    },
  } = req;
  try {
    const token = getTokenFromAuthHeader(authHeader);
    const isValidToken = await njwt.verify(token, accessTokenSecret);
    if (isValidToken) {
      next();
    } else {
      res.send(403);
    }
  } catch (e) {
    res.send(401);
  }
};

export {
  authenticateJWT,
};
