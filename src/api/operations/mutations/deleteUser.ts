import {gql} from "@apollo/client";

export const DELETE_USER = gql`
    mutation deleteOneUser($where: UserWhereUniqueInput!) {
        deleteOneUser(where: $where) {
          id
          firstName
          lastName
          patronymic
          type
        }
    }
`;