import React, {useEffect} from 'react';
import './App.css';
import Layout from "./components/layout/Layout";

function App() {

  // @ts-ignore
  useEffect(() => document.title = 'Auditorium', []);

  return (
    <Layout/>
  );
}

export default App;
