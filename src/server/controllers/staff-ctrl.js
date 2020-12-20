import {
  docClient,
  generateAccessToken,
  validatePassword,
  getPayloadData,
  getTokenFromAuthHeader,
  transformLoanListToLoanDetails,
} from '../../api-utils';
import {
  tableNames,
  internalServerError,
  forbidden,
} from '../../common';

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

const staffLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const params = {
    TableName: tableNames.STAFF,
    FilterExpression: 'un = :un',
    ExpressionAttributeValues: {
      ':un': username,
    },
  };
  const { Items } = await docClient.scan(params).promise();
  try {
    const {
      pw: hashedPassword,
      id: staffId,
      d: designation,
    } = Items[0];
    const isCorrectPassword = await validatePassword(password, hashedPassword);
    if (isCorrectPassword) {
      const input = {
        sub: username,
        empId: staffId,
        iss: 'staff/loan-request',
        scope: designation,
      };
      const token = generateAccessToken(input);
      res.send({ token });
    } else {
      res.send('Invalid password');
    }
  } catch (e) {
    console.log('Error getting staff object', e);
    res.send('Invalid username');
  }
};

const viewLoanRequests = async (req, res) => {
  try {
    const {
      headers: { authorization: authHeader },
    } = req;
    const token = getTokenFromAuthHeader(authHeader);
    const { empId, scope } = getPayloadData(token);
    const params = {
      TableName: tableNames.LOAN,
    };
    if (scope === 'CRM') {
      params.FilterExpression = 'cId = :cId';
      params.ExpressionAttributeValues = {
        ':cId': empId,
      };
    }
    const { Items: loanList } = await docClient.scan(params).promise();
    res.send(transformLoanListToLoanDetails(loanList));
  } catch (e) {
    console.log('Error getting loan requests', e);
    res.send(internalServerError);
  }
};

const actOnLoanRequest = async (req, res) => {
  try {
    const {
      headers: { authorization: authHeader },
      body: { status, loanId },
    } = req;
    const token = getTokenFromAuthHeader(authHeader);
    const { scope } = getPayloadData(token);
    const params = {
      TableName: tableNames.LOAN,
      Key: {
        id: loanId,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    if (scope === 'CRM') {
      params.UpdateExpression = 'SET st1 = :st1';
      params.ExpressionAttributeValues = {
        ':st1': status,
      };
    } else if (scope === 'BRANCH_MANAGER') {
      params.UpdateExpression = 'SET st2 = :st2';
      params.ExpressionAttributeValues = {
        ':st2': status,
      };
    } else {
      res.send(forbidden);
    }
    await docClient.update(params).promise();
    res.send('success');
  } catch (e) {
    console.log('Error Updating Loan Status', e);
    res.send(internalServerError);
  }
};

export {
  getAssignableCRM,
  staffLogin,
  actOnLoanRequest,
  incrementLoanRequestAssigned,
  viewLoanRequests,
};
