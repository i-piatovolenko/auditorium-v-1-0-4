import { gql } from "@apollo/client";

export const GET_CLASSROOM = gql`
  query getClassroom($where: ClassroomWhereUniqueInput!) {
    classroom(where: $where) {
      id
      queue {
        id
      }
    }
  }
`;