import React, {useEffect, useRef, useState} from 'react';
import styles from './dashboard.module.css';
import Header from "../../components/header/Header";
import moment from "moment";
import {ClassroomType, EnqueuedBy, OccupiedState, User} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import {GET_GENERAL_QUEUE} from "../../api/operations/queries/generalQueue";
import {GET_PENDING_CLASSROOMS} from "../../api/operations/queries/pendingClassrooms";
import strings from '../../localize/localize';
import {client, isLoggedVar} from "../../api/client";
import {GET_FREE_CLASSROOMS} from "../../api/operations/queries/freeClassrooms";
import Button from "../../components/button/Button";
import Splash from "../../components/splash/Splash";
import {useHistory} from "react-router-dom";

const langs = {
  EN: 'en',
  UA: 'ua'
};

function Dashboard() {
  const history = useHistory();
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [lang, setLang] = useState(langs.UA);
  const [freeClassrooms, setFreeClassrooms] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(false);
  const timer = useRef<any>(null);
  const timerLang = useRef<any>(null);
  const timerQueue = useRef<any>(null);
  const splashInterval = useRef(null);

  useEffect(() => {
    if (lang === langs.UA) {
      clearInterval(timerLang.current);
      timerLang.current = setInterval(() => {
        setLang(langs.EN);
      }, 15000)
    } else {
      clearInterval(timerLang.current);
      timerLang.current = setInterval(() => {
        setLang(langs.UA);
      }, 5000)
    }
  }, [lang]);

  useEffect(() => {
    if (showSplash) {
      clearInterval(splashInterval.current);
      splashInterval.current = setInterval(() => {
        setShowSplash(false);
      }, 5000);
    } else {
      clearInterval(splashInterval.current);
      splashInterval.current = setInterval(() => {
        !classrooms.length && setShowSplash(true);
      }, 10000);
    }
  }, [showSplash]);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
    timerQueue.current = setInterval(() => {
      client.query({
        query: GET_GENERAL_QUEUE,
        fetchPolicy: 'network-only'
      }).then(data => {
        // @ts-ignore
        if (data.data.generalQueue.length) {
          setShowSplash(false);
        }
        setData(data.data);
      });

      client.query({
        query: GET_PENDING_CLASSROOMS,
        variables: {
          where: {
            OR: [
              {
                occupied: {
                  state: {
                    equals: OccupiedState.PENDING
                  }
                }
              },
              {
                occupied: {
                  state: {
                    equals: OccupiedState.RESERVED
                  },
                  user: {
                    queueInfo: {
                      currentSession: {
                        enqueuedBy: {
                          equals: EnqueuedBy.DISPATCHER
                        }
                      }
                    }
                  }
                }
              }
            ]

          }
        },
        fetchPolicy: 'network-only'
      }).then(data => {
        setClassrooms(data.data.classrooms);
      });

      client.query({
        query: GET_FREE_CLASSROOMS,
        variables: {
          where: {
            occupied: {
              state: {
                equals: OccupiedState.FREE
              }
            }
          }
        },
        fetchPolicy: 'network-only'
      }).then(data => {
        //@ts-ignore
        if (data.data.classrooms.length) {
          setShowSplash(false);
        }
        setFreeClassrooms(data.data.classrooms.map(({name}: ClassroomType) => name));
      });
    }, 5000);

    return () => {
      clearInterval(splashInterval.current);
      clearInterval(timer.current);
      clearInterval(timerLang.current);
      clearInterval(timerQueue.current);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    isLoggedVar(false);
  };

  return (
    <div className={styles.wrapper}>
      <Splash show={showSplash} currentTime={currentTime}/>
      <div className={styles.hiddenLogout}>
        <Button onClick={handleLogoutClick} color='red'>Вийти з акаунту</Button>
      </div>
      <Header>
        <div className={styles.header}>
          {/*@ts-ignore*/}
          <h1>{(strings[lang]).generalQueue}</h1>
          {/*@ts-ignore*/}
          <h1>{strings[lang].pendingConfirmation}</h1>
          <h2>{currentTime}</h2>
        </div>
      </Header>
      <div className={styles.container}>
        <div>
          {data && !data.generalQueue.length && (
            <h1 className={styles.noQueue}>{
              /*@ts-ignore*/
              (strings[lang]).noQueue}
            </h1>
          )}
          <ul className={styles.generalQueue}>
            {data && data.generalQueue
              .slice(0, 10)
              .map((user: User, index: number) => (
                <li key={user.id}>
                  <span>{index + 1} </span>
                  <span className={styles.fullName}>
                  {user.nameTemp || fullName(user, true)}
                </span>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.rightPart}>
          <ul className={styles.waitingApprove}>
            {classrooms && classrooms
              .map(({id, name, occupied}) => (
                <li key={id}>
                <span className={styles.classroomName}>
                  Ауд. {name}
                </span>
                  <span>
                  {occupied!.user.nameTemp || fullName(occupied!.user, true)}
                </span>
                </li>
              ))
            }
          </ul>
          <div className={styles.info}>
            <p>
              {/*@ts-ignore*/}
              {strings[lang].queueSize}{data && data.generalQueue.length}
            </p>
            <p>
              {
                freeClassrooms ? freeClassrooms.length > 5
                  /*@ts-ignore*/
                  ? `${strings[lang].vilnukhAud}${freeClassrooms.length}`
                  : (
                    <>
                      {/*@ts-ignore*/}
                      {strings[lang].freeClassrooms}
                      {freeClassrooms.map(name => <span>{name}</span>)}
                    </>
                  )
                  /*@ts-ignore*/
                  : strings[lang].noFreeClassrooms
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
