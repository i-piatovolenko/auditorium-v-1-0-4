import {gql} from "@apollo/client";

export const CRASH_MODE_SWITCH_OFF = gql`
    mutation crashModeSwitchOff {
        crashModeSwitchOff {
            crashMode {
                isActive
                until
                comment
            }
            userErrors {
                message
                code
            }
        }
    }
`;
