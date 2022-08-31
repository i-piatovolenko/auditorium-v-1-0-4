import {gql} from "@apollo/client";

export const CREATE_CLASSROOM = gql`
    mutation createOneClassroom($data: ClassroomCreateInput!) {
        createOneClassroom(data: $data) {
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
        }
    }
`;