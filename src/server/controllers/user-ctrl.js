import {
  generateUUID,
  docClient,
  generatePasswordHash,
  generateAccessToken,
  validatePassword,
} from '../../api-utils';
import {
  internalServerError,
  tableNames,
} from '../../common';
/*
The userSignup Function creates a new user in usertable and
returns a token which will be valid for 30 minutes
*/

const userSignup = async (req, res) => {
  try {
    const {
      body: {
        username,
        password,
      },
    } = req;
    const hash = generatePasswordHash(password);
    const input = {
      id: generateUUID(),
      un: username,
      pw: hash,
    };
    const params = {
      TableName: tableNames.USER,
      Item: input,
    };
    await docClient.put(params).promise();
    const token = generateAccessToken({ username: req.body.username });
    res.send({ token });
  } catch (e) {
    console.log('Error Creating user record', e);
    res.send(internalServerError);
  }
};

const userLogin = async (req, res) => {
  const {
    body: {
      username,
      password,
    },
  } = req;
  // TODO: Get username and password hash from db
  try {
    if (validatePassword(password, hash)) {
      const token = generateAccessToken(username);
      res.send({ token });
    } else {
      res.send('Invalid password');
    }
  } catch (e) {
    console.log('Error getting user object');
    res.send('Invalid username');
  }
};

const createLoanRequest = (req, res) => {

};

const viewLoanStatus = (req, res) => {

};

export {
  userSignup,
  userLogin,
  createLoanRequest,
  viewLoanStatus,
};
