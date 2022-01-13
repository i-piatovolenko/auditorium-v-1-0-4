import {gql} from "@apollo/client";

export const DELETE_SCHEDULE_UNIT = gql`
    mutation deleteOneScheduleUnit($input: DeleteOneScheduleUnitInput!) {
        deleteOneScheduleUnit(input: $input) {
            updatedSubstitutions {
              id
              user {
                id
                firstName
                lastName
                patronymic
                type
              }
              classroom {
                id
                name
              }
              type
              dateStart
              dateEnd
              from
              to
              activity
              dayOfWeek
            }
            userErrors {
              message
              code
            }
        }
    }
`;
