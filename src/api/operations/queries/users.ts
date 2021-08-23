import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      firstName
      patronymic
      lastName
      type
      department {
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

export const GET_USER_BY_ID = gql`
  query getUserById($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      patronymic
      lastName
      type
      department {
        name
      }
      email
      phoneNumber
      extraPhoneNumbers
      nameTemp
      studentInfo {
        degree {
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

export const GET_USER_OCCUPIED_CLASSROOMS_BY_USER_ID = gql`
  query getUserOccupiedClassroomsByUserId($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      occupiedClassrooms {
        id
        state
        classroom {
          id
          name
          
        }
      }
     }
  }
`;