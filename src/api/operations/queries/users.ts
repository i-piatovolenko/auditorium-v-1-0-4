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
      expireDate
      queueInfo {
        sanctionedUntil
      }
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
        isInUsage
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
        id
        name
      }
      email
      phoneNumber
      extraPhoneNumbers
      nameTemp
      expireDate
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