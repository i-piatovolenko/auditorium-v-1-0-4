import {gql} from "@apollo/client";

export const UPDATE_CLASSROOM = gql`
    mutation updateOneClassroom($data: ClassroomUpdateInput!, $where: ClassroomWhereUniqueInput!) {
        updateOneClassroom(data: $data, where: $where) {
          id
          description
          name
          floor
          special
          isHidden
          chair {
              name
          }
          isWing
          isOperaStudio
          occupied {
            user {
              id
              firstName
              patronymic
              lastName
              type
              nameTemp
              email
              phoneNumber
              department {
                  name
              }
            }
            until
            state
          }
          instruments {
            name
            type
            rate
          }
          disabled {
            comment
            until
            state
          }
          color
        }
    }
`;