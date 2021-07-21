import { gql } from "@apollo/client";

export const GET_PENDING_CLASSROOMS = gql`
  query getPendingClassrooms($where: ClassroomWhereInput) {
    classrooms(where: $where) {
      id
      name
      occupied {
        user {
          id
          firstName
          patronymic
          lastName
          nameTemp
        }
        until
        state
      }
    }
  }
`;