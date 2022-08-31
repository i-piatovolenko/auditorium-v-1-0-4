import {gql} from "@apollo/client";

export const RELEASE_KEY_HOLDER = gql`
    mutation releaseKeyHolder($input: ReleaseKeyHolder!) {
        releaseKeyHolder(input: $input) {
            classroom {
              id
              name
              occupied {
                user {
                  id
                }
                state
                keyHolder {
                id
                }
              }
            }
            userErrors {
                message
                code
            }
        }
    }
`;
