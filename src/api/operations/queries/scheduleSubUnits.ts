import {gql} from '@apollo/client';

export const GET_SCHEDULE_SUBSTITUTIONS_UNITS = gql`
  query scheduleSubstitutionUnits($where: ScheduleUnitWhereUniqueInput!) {
    scheduleUnit(where: $where) {
      id
      substitutions {
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
      }
  }
`;
