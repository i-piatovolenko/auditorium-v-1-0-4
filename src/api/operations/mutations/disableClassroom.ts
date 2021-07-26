import {gql} from "@apollo/client";

export const DISABLE_CLASSROOM = gql`
    mutation disable($input: DisableClassroomInput!) {
        disableClassroom(input: $input) {
            classroom {
            id
            name
            disabled {
                comment
                until
            }
            }
            userErrors {
                message
                code
            }
        }
    }
`;
