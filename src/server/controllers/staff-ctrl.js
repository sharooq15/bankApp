import {
  generateUUID,
  docClient,
  generatePasswordHash,
  generateAccessToken,
  validatePassword,
  getPayloadData,
  getTokenFromAuthHeader,
} from '../../api-utils';
import { internalServerError, tableNames, forbidden } from '../../common';

/*
Create Staff API was used to create the staff inside the staff table.
As there are only limited number of staff members, I removed the createStaff API
*/
const incrementLoanRequestAssigned = async (id) => {
  try {
    const params = {
      TableName: tableNames.STAFF,
      Key: {
        id,
      },
      UpdateExpression: 'ADD lra  :lra',
      ExpressionAttributeValues: {
        ':lra': 1,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    await docClient.update(params).promise();
    return true;
  } catch (e) {
    console.log('Error Incrementing LRA', e);
    return false;
  }
};

const getAssignableCRM = async () => {
  const params = {
    TableName: tableNames.STAFF,
    FilterExpression: 'd = :d',
    ExpressionAttributeValues: {
      ':d': 'CRM',
    },
  };
  const { Items: crmList } = await docClient.scan(params).promise();
  let assignableCRM = crmList[0];
  for (let i = 0; i < crmList.length - 1; i += 1) {
    if (crmList[i].lra > crmList[i + 1].lra) {
      assignableCRM = crmList[i + 1];
      break;
    } else if (i !== 0 && crmList[i].lra === crmList[i + 1].lra) {
      // eslint-disable-next-line no-continue
      continue;
    }
  }
  return assignableCRM;
};

const staffLogin = (req, res) => {
  // staff login
};

const actOnLoanRequest = (req, res) => {
  // logic to act on loans
};

export {
  getAssignableCRM,
  staffLogin,
  actOnLoanRequest,
  incrementLoanRequestAssigned,
};
