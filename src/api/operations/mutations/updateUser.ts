import {gql} from "@apollo/client";

export const UPDATE_USER = gql`
    mutation updateOneUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
        updateOneUser(data: $data, where: $where) {
            id
            queueInfo {
              sanctionedUntil
            }
        }
    }
`;