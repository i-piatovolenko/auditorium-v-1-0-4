import {gql} from "@apollo/client";

export const CREATE_USER = gql`
    mutation createOneUser($data: UserCreateInput!) {
        createOneUser(data: $data) {
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