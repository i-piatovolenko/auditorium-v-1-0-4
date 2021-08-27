import {gql} from "@apollo/client";

export const SIGNUP_EMPLOYEE = gql`
    mutation signupEmployee($input: SignupEmployeeInput!) {
        signupEmployee(input: $input) {
            id
      firstName
      patronymic
      lastName
      type
      department {
        id
        name
      }
      occupiedClassrooms {
        id
          state
          classroom {
            id
            name
          }
      }
      email
      phoneNumber
      extraPhoneNumbers
      nameTemp
      studentInfo {
        degree {
          id
          name
        }
        startYear
        accountStatus
      }
      employeeInfo {
        employmentType
        accountStatus
      }
        }
    }
`;