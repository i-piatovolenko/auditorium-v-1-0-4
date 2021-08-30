import {gql} from "@apollo/client/core";

export const FOLLOW_USERS = gql`
 subscription allUsersUpdate {
    allUsersUpdate {
    user {
      id
      occupiedClassrooms {
        id
        state
        classroom {
          id
          name
        }
      }
      queue {
        id
        state
        classroom {
          id
        }
      }
      queueInfo {
        id
        sanctionedUntil
        currentSession {
          id
          state
          skips
        }
      }
    }
  }
}
`;