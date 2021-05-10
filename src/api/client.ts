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
              return meType();
            },
          },
          isButtonDisabled: {
            read() {
              return isButtonDisabled();
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
export const meType = makeVar("USER");
export const isButtonDisabled = makeVar(false);
