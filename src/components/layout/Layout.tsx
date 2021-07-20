import React, {useEffect} from "react";
import styles from "./layout.module.css";
import Sidebar from "./sidebar/Sidebar";
import Content from "./content/Content";
import {isLoggedVar} from "../../api/client";
import {useLocal} from "../../hooks/useLocal";

const Layout = () => {
  const { data: {isBlurred}} = useLocal('isBlurred');
  const { data: {isLogged}} = useLocal('isLogged');
  const isDashboard = window.location.pathname.includes('dashboard');

  useEffect(()=> {
    isLoggedVar(!!JSON.parse(localStorage.getItem('user') as string));
  }, []);

  useEffect(() => {
    console.log(isDashboard)
  }, [])

  return (
    <div
      className={[
        styles.layout,
        isBlurred ? styles.blurred : "",
      ].join(" ")}
    >
      {isLogged && !isDashboard && <nav>
        <Sidebar/>
      </nav>}
      <main>
        <Content isLogged={isLogged}/>
      </main>
    </div>
  );
};

export default Layout;
