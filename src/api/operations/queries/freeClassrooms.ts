import { gql } from "@apollo/client";

export const GET_FREE_CLASSROOMS = gql`
  query getFreeClassrooms($where: ClassroomWhereInput) {
    classrooms(where: $where) {
      id
      name
    }
  }
`;