import {gql} from "@apollo/client";

export const CRASH_MODE_SWITCH_ON = gql`
    mutation crashModeSwitchOn($input: CrashModeSwitchOnInput!) {
        crashModeSwitchOn(input: $input) {
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
