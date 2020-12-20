import {
  generateUUID,
  docClient,
  generatePasswordHash,
  generateAccessToken,
  validatePassword,
  getPayloadData,
  getTokenFromAuthHeader,
} from '../../api-utils';
import {
  internalServerError,
  tableNames,
  forbidden,
} from '../../common';
import {
  handleLoanRequest,
} from './loan-ctrl';
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
    const hash = await generatePasswordHash(password);
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
    const token = generateAccessToken({ name: req.body.username, access: 'User' });
    res.send({ token });
  } catch (e) {
    // eslint-disable-next-line no-console
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
  const { Items } = await docClient.scan(params).promise();
  try {
    const isCorrectPassword = await validatePassword(password, Items[0].pw);
    if (isCorrectPassword) {
      const input = {
        sub: username,
        iss: 'user/loan-request',
        scope: 'USER',
      };
      const token = generateAccessToken(input);
      res.send({ token });
    } else {
      res.send('Invalid password');
    }
  } catch (e) {
    console.log('Error getting user object');
    res.send('Invalid username');
  }
};

const createLoanRequest = async (req, res) => {
  const {
    headers: { authorization: authHeader },
    body: { loanAmount },
  } = req;
  const token = getTokenFromAuthHeader(authHeader);
  const payload = getPayloadData(token);
  const { sub: username, scope } = payload;
  if (scope === 'USER') {
    const loanRequestDetails = await handleLoanRequest(loanAmount, username);
    res.send(loanRequestDetails);
  } else {
    res.send(forbidden);
  }
};

export {
  userSignup,
  userLogin,
  createLoanRequest,
};
