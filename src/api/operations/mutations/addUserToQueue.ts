import {gql} from "@apollo/client";

export const ADD_USER_TO_QUEUE = gql`
    mutation addUserToQueue($input: AddUserToQueueInputType!) {
        addUserToQueue(input: $input) {
          user {
            id
            firstName
            lastName
           
          }
          userErrors {
              message
              code
            }
        }
    }
`;