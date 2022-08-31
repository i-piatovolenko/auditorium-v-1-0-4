import {gql} from "@apollo/client";

export const SIGNUP_EMPLOYEE = gql`
    mutation signupEmployee($input: SignupEmployeeInput!) {
        signupEmployee(input: $input) {
            user {
                id
                firstName
                patronymic
                lastName
                type
                department {
                    id
                    name
                }
                employeeInfo {
                    employmentType
                    accountStatus
                }
                } 
                userErrors {
                    message
                    code
                }
        }
    }
`;