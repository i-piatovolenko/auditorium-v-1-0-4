import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

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
          meType: {
            read() {
              return meTypeVar();
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
export const meTypeVar = makeVar("USER");
export const isButtonDisabledVar = makeVar(false);
export const isPassedVar = makeVar(false);
