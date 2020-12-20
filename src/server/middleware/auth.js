import njwt from 'njwt';
import {
  getTokenFromAuthHeader,
} from '../../api-utils';
import {
  accessTokenSecret,
  forbidden,
  unauthorized,
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
      res.send(forbidden);
    }
  } catch (e) {
    res.send(unauthorized);
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  authenticateJWT,
};
