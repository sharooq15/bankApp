import { v4 as UUIDv4 } from 'uuid';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import njwt from 'njwt';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import awsConfig from '../../aws-config';
import { accessTokenSecret } from '../common';

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const generateUUID = () => UUIDv4();

const generatePasswordHash = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const validatePassword = async (password, hash) => {
  const status = await bcrypt.compare(password, hash);
  return status;
};

const generateAccessToken = (input) => njwt.create(input, accessTokenSecret).compact();

const getPayloadData = (token) => jwt_decode(token, { header: false });

const getTokenFromAuthHeader = (authHeader) => authHeader.split(' ')[1];

const transformLoanListToLoanDetails = (loanList) => {
  const loanDetails = loanList.map((loan) => ({
    id: loan.id,
    assignedCRM: loan.cId,
    loanAmount: loan.lA,
    status: loan.st,
  }));
  return loanDetails;
};

export {
  generateUUID,
  docClient,
  generatePasswordHash,
  validatePassword,
  generateAccessToken,
  getPayloadData,
  getTokenFromAuthHeader,
  transformLoanListToLoanDetails,
};
