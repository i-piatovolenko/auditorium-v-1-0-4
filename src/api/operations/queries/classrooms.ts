import { gql } from "@apollo/client";

export const GET_CLASSROOMS = gql`
  query getClassrooms {
    classrooms {
      id
      description
      name
      floor
      special
      isHidden
      chair {
          id
          name
      }
      isWing
      isOperaStudio
      occupied {
        user {
          id
          firstName
          patronymic
          lastName
          type
          nameTemp
          email
          phoneNumber
          department {
              name
          }
        }
        until
        state
      }
      instruments {
        id
        name
        type
        rate
      }
      disabled {
        comment
        until
        state
      }
      queueInfo {
        queuePolicy {
          policy
          queueAllowedDepartments {
            department {
              id
              name
            }
          }
          }
        }
    }
  }
`;