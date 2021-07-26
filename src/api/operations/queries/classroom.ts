import { gql } from "@apollo/client";

export const GET_CLASSROOM = gql`
  query getClassroom($id: Int!) {
    classroom(id: id) {
      id
      disabled {
        comment
        until
      }
    }
  }
`;