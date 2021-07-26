import {gql} from "@apollo/client";

export const FREE_CLASSROOM = gql`
    mutation free($input: FreeClassroomInput!) {
        freeClassroom(input: $input) {
            classroom {
                id
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
            }
                userErrors {
                    message
                    code
                }
            }
        }
`;
