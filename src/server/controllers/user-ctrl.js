import jwt from 'jsonwebtoken';
import {
  generateUUID,
  docClient,
  generatePasswordHash,
} from '../../api-utils';
import {
  internalServerError,
  tableNames,
} from '../../common';
/*
The userSignup Function creates a new user in usertable and
returns a token which will be valid for 30 minutes
*/
const dummyun = 'username';
const dummypw = 'pw';
const accessTokenSecret = 'ats';

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
    // await docClient.put(params).promise();
    if (username === dummyun && password === dummypw) {
      const accessToken = jwt.sign({ username }, accessTokenSecret, {
        expiresIn: '20m',
      });
      res.send({
        accessToken,
      });
    } else {
      res.send('wrong username and password');
    }
  } catch (e) {
    console.log('Error Creating user record', e);
    res.send(internalServerError);
  }
};

export {
  userSignup,
};
