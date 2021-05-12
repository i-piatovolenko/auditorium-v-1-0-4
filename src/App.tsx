import React, {useEffect} from 'react';
import './App.css';
import Layout from "./components/layout/Layout";
import {setAccessRights} from "./helpers/helpers";

function App() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    document.title = 'Auditorium';

    setAccessRights(user);
  }, []);

  return (
    <Layout/>
  );
}

export default App;
