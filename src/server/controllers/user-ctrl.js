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
import {
  getAssignableCRM,
} from './staff-ctrl';
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
    console.log('inside userSignup', username, password);
    const hash = await generatePasswordHash(password);
    console.log('hash', hash);
    const input = {
      id: generateUUID(),
      un: username,
      pw: hash,
    };
    const params = {
      TableName: tableNames.USER,
      Item: input,
    };
    console.log('params', params);
    await docClient.put(params).promise();
    const token = generateAccessToken({ name: req.body.username, access: 'User' });
    console.log('token', token);
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
  const params = {
    TableName: tableNames.USER,
    FilterExpression: 'un = :un',
    ExpressionAttributeValues: {
      ':un': username,
    },
  };
  const [Items] = await docClient.scan(params).promise();
  try {
    if (validatePassword(password, Items.password)) {
      const token = generateAccessToken({ name: req.body.username, access: 'User' });
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

export {
  userSignup,
  userLogin,
  createLoanRequest,
};
