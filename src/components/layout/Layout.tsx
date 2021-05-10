import React, {useEffect, useState} from "react";
import styles from "./layout.module.css";
import Sidebar from "./sidebar/Sidebar";
import Content from "./content/Content";
import { gql, useQuery } from "@apollo/client";
import {isLoggedVar} from "../../api/client";

const Layout = () => {
  const { data: isBlurred } = useQuery(gql`
    query isBlurred {
      isBlurred @client
    }
  `);
  const { data: isLogged } = useQuery(gql`
    query isLogged {
      isLogged @client
    }
  `);

  useEffect(()=> {
    isLoggedVar(!!JSON.parse(localStorage.getItem('user') as string));
  }, []);

  return (
    <div
      className={[
        styles.layout,
        isBlurred.isBlurred ? styles.blurred : "",
      ].join(" ")}
    >
      {isLogged.isLogged && <nav>
        <Sidebar/>
      </nav>}
      <main>
        <Content isLogged={isLogged.isLogged}/>
      </main>
    </div>
  );
};

export default Layout;
