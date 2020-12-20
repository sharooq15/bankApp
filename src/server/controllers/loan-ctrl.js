import {
  generateUUID,
  docClient,
} from '../../api-utils';
import {
  getAssignableCRM,
  incrementLoanRequestAssigned,
} from './staff-ctrl';
import { tableNames } from '../../common';

const getLoanList = (req, res) => {
  // Logic to return complete loan lst for branch manager
  // and return only specific list for crms
};

const viewLoanStatus = (req, res) => {};

const handleLoanRequest = async (loanAmount, username) => {
  try {
    const assignableCRM = await getAssignableCRM();
    const input = {
      id: generateUUID(),
      lA: loanAmount,
      un: username,
      cId: assignableCRM.id,
    };
    const params = {
      TableName: tableNames.LOAN,
      Item: input,
    };
    await incrementLoanRequestAssigned(assignableCRM.id);
    await docClient.put(params).promise();
    return {
      loanRequestId: input.id,
      AssignedCRM: {
        id: assignableCRM.id,
        name: assignableCRM.name,
      },
    };
  } catch (e) {
    console.log('Error creating Loan Request', e);
  }
};

export {
  getLoanList,
  viewLoanStatus,
  handleLoanRequest,
};
