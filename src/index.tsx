import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {ApolloProvider} from "@apollo/client";
import {client} from "./api/client";
import PopupWindowProvider from "./components/popupWindow/PopupWindowProvider";
import NotificationProvider from "./components/notification/NotificationProvider";
import {BrowserRouter, HashRouter} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ApolloProvider client={client}>
        <PopupWindowProvider>
          <NotificationProvider>
            <App/>
          </NotificationProvider>
        </PopupWindowProvider>
      </ApolloProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
