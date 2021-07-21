import React, {useEffect, useRef, useState} from 'react';
import styles from './dashboard.module.css';
import Header from "../../components/header/Header";
import moment from "moment";
import {ClassroomType, LangT, OccupiedState, User} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import {GET_GENERAL_QUEUE} from "../../api/operations/queries/generalQueue";
import {GET_PENDING_CLASSROOMS} from "../../api/operations/queries/pendingClassrooms";
import strings from '../../localize/localize';
import {client} from "../../api/client";
import {GET_FREE_CLASSROOMS} from "../../api/operations/queries/freeClassrooms";

function Dashboard() {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [lang, setLang] = useState<LangT>('ua');
  const [freeClassrooms, setFreeClassrooms] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const timer = useRef<any>(null);
  const timerLang = useRef<any>(null);
  const timerQueue = useRef<any>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
    timerLang.current = setInterval(() => {
      setLang(prevState => prevState === 'ua' ? 'en' : 'ua')
    }, 15000);
    timerQueue.current = setInterval(() => {
      client.query({
        query: GET_GENERAL_QUEUE,
        fetchPolicy: 'network-only'
      }).then(data => {
        // @ts-ignore
        setData(data.data);
      });

      client.query({
        query: GET_PENDING_CLASSROOMS,
        variables: {
          where: {
            state: {
              equals: OccupiedState.PENDING
            }
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
            state: {
              equals: null
            }
          }
        },
        fetchPolicy: 'network-only'
      }).then(data => {
        // @ts-ignore
        setFreeClassrooms(data.data.classrooms.map(({name}) => name));
      });
    }, 5000);

    return () => {
      clearInterval(timer.current);
      clearInterval(timerLang.current);
      clearInterval(timerQueue.current);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header>
        <div className={styles.header}>
          <h1>{strings[lang].generalQueue}</h1>
          <h1>{strings[lang].pendingConfirmation}</h1>
          <h2>{currentTime}</h2>
        </div>
      </Header>
      <div className={styles.container}>
        <div>
          <ul className={styles.generalQueue}>
            {data && data.generalQueue
              .slice(0, 10)
              .map((user: User, index: number) => (
              <li key={user.id}>
                <span>{index+1} </span>
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
              {strings[lang].queueSize}{data && data.generalQueue.length}
            </p>
            <p>
              {
                freeClassrooms ? freeClassrooms.length > 5
                  ? `${strings[lang].vilnukhAud}${freeClassrooms.length}`
                  : `${strings[lang].freeClassrooms}${freeClassrooms}`
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