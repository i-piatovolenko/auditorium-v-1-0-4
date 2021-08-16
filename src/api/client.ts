import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import {ACCESS_RIGHTS} from "../models/models";

export const client = new ApolloClient({
  uri: 'http://54.75.17.229:4000/',
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLogged: {
            read() {
              return isLoggedVar();
            },
          },
          isBlurred: {
            read() {
              return isBlurredVar();
            },
          },
          gridUpdate: {
            read() {
              return gridUpdate();
            },
          },
          accessRights: {
            read() {
              return accessRightsVar();
            },
          },
          isButtonDisabled: {
            read() {
              return isButtonDisabledVar();
            },
          },
          isPassed: {
            read() {
              return isPassedVar();
            },
          },
        },
      },
    },
  }),
});
export const isLoggedVar = makeVar(false);
export const isBlurredVar = makeVar(false);
export const gridUpdate = makeVar(false);
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);
export const isButtonDisabledVar = makeVar(false);
export const isPassedVar = makeVar(false);
