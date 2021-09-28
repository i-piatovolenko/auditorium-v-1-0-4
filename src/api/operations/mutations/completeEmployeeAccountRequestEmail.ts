import {gql} from "@apollo/client";

export const COMPLETE_EMPLOYEE_ACCOUNT = gql`
    mutation completeEmployeeAccountRequestEmail($input: CompleteEmployeeAccountRequestEmailInput!) {
        completeEmployeeAccountRequestEmail(input: $input) {
            operationSuccess
            userErrors {
                message
                code
            }
        }
    }
`;
