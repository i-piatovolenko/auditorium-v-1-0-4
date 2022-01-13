import {gql} from "@apollo/client";

export const UPDATE_SCHEDULE_UNIT = gql`
    mutation updateOneScheduleUnit($where: ScheduleUnitWhereUniqueInput!, $data: ScheduleUnitUpdateInput!) {
        updateOneScheduleUnit(where: $where, data: $data) {
            id
            user {
              id
              firstName
              lastName
              patronymic
              type
            }
            type
            dateStart
            dateEnd
            from
            to
            activity
        }
    }
`;
