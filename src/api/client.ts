import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import {ACCESS_RIGHTS} from "../models/models";

const serverURL = localStorage.getItem('serverURL');

export const client = new ApolloClient({
  uri: serverURL ? serverURL as string : 'http://3.141.103.67:4000/',
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
