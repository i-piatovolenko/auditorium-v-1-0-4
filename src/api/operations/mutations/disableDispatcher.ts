import {gql} from "@apollo/client";

export const DISABLE_DISPATCHER = gql`
    mutation disableDispatcher {
        disableDispatcher {
            operationSuccess
            userErrors {
                message
                code
            }
        }
    }
`;
