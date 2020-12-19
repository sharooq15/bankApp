import { v4 as UUIDv4 } from 'uuid';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import awsConfig from '../../aws-config';
import { accessTokenSecret } from '../common';

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const generateUUID = () => UUIDv4();

const generatePasswordHash = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds).promise();
  return hash;
};

const validatePassword = async (password, hash) => {
  const status = await bcrypt.compare(password, hash).promise();
  return status;
};

const generateAccessToken = (username) => jwt.sign(username, accessTokenSecret, { expiresIn: '1800s' });

export {
  generateUUID,
  docClient,
  generatePasswordHash,
  validatePassword,
  generateAccessToken,
};
