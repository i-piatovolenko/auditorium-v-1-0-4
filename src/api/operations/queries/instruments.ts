import { gql } from "@apollo/client";

export const GET_INSTRUMENTS = gql`
    query getInstruments {
        instruments {
            id
            persNumber
            type
            name
            rate
            classroom {
              id
              name
            }
        }
    }
`;