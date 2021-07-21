import { gql } from "@apollo/client";

export const GET_USERS_FOR_QUEUE = gql`
  query getUsersForQueue {
    users {
      id
      firstName
      patronymic
      lastName
      queue {
        id
      }
    }
  }
`;
