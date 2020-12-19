import { v4 as UUIDv4 } from 'uuid';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import awsConfig from '../common/aws-config';

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const generateUUID = () => UUIDv4();

const generatePasswordHash = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds).promise();
  return hash;
};

export { generateUUID, docClient, generatePasswordHash };
