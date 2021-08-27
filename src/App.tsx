import React, {useEffect, useRef, useState} from 'react';
import styles from './app.module.css';
import Layout from "./components/layout/Layout";
import {setAccessRights} from "./helpers/helpers";
import {client} from "./api/client";
import {GET_CLASSROOMS} from "./api/operations/queries/classrooms";
import {GET_USERS} from "./api/operations/queries/users";
import Button from "./components/button/Button";
import {MINUTE} from "./helpers/constants";

function App() {
  let timer = useRef(null);
  const [showResumePopup, setShowResumePopup] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    document.title = 'Auditorium';

    setAccessRights(user);

    window.addEventListener('click', () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setShowResumePopup(true);
      }, MINUTE * 15);
    });

    window.addEventListener('focus', () => {
      getData();
    });
    window.addEventListener('freeze', () => {
      setShowResumePopup(true);
    });
    window.addEventListener('resume', () => {
      getData();
    });
    return () => {
      window.removeEventListener('click', () => {});
      window.removeEventListener('focus', () => {});
      window.removeEventListener('resume', () => {});
      window.removeEventListener('freeze', () => {});
    }
  }, []);

  const getData = async () => {
    try {
      await client.query({
        query: GET_CLASSROOMS,
        fetchPolicy: 'network-only'
      });
      await client.query({
        query: GET_USERS,
        fetchPolicy: 'network-only'
      })
    } catch (e) {
      console.log(e);
    }
  };

  const handleResume = async () => {
    await getData();
    setShowResumePopup(false);
  };

  return (
    <>
      {showResumePopup && <div className={styles.updateDataModal}>
        <div className={styles.popup}>
          <Button onClick={handleResume}>Продовжити роботу</Button>
        </div>
      </div>}
      <Layout/>
    </>
  );
}

export default App;
