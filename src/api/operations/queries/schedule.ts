import { gql } from "@apollo/client";

export const GET_SCHEDULE_UNIT = gql`
  query getScheduleUnit($classroomName: String!, $date: DateTime!) {
    schedule(classroomName: $classroomName, date: $date) {
      id
      type
      user {
        id
        lastName
        firstName
        patronymic
      }
      dateStart
      dateEnd
      from
      to
      activity
    }
  }
`;
