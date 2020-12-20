import {
  generateUUID,
  docClient,
} from '../../api-utils';

import {
  getAssignableCRM,
  incrementLoanRequestAssigned,
} from './staff-ctrl';

import { tableNames } from '../../common';

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
        name: assignableCRM.un,
      },
    };
  } catch (e) {
    console.log('Error creating Loan Request', e);
  }
  return {};
};

export {
  // eslint-disable-next-line import/prefer-default-export
  handleLoanRequest,
};
