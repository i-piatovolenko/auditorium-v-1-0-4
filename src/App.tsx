import React, {useEffect} from 'react';
import Layout from "./components/layout/Layout";
import {setAccessRights} from "./helpers/helpers";
import {User, UserTypes} from "./models/models";
import {useHistory} from "react-router-dom";

function App() {
  const history = useHistory();

  useEffect(() => {
    const user:User = JSON.parse(localStorage.getItem('user') as string);
    if (user && user.type === UserTypes.STAFF) {
      history.push('/dashboard');
    }
    document.title = 'Auditorium';

    setAccessRights(user);

  }, []);

  return <Layout/>;
}

export default App;
