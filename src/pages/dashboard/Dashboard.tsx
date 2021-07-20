import React, {useEffect, useRef, useState} from 'react';
import styles from './dashboard.module.css';
import Header from "../../components/header/Header";
import moment from "moment";
import {useQuery} from "@apollo/client";
import {GET_QUEUE_RECORDS} from "../../api/operations/queries/queueRecords";
import {OccupiedState, QueueRecord, User} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import useClassrooms from "../../hooks/useClassrooms";
import {GET_GENERAL_QUEUE} from "../../api/operations/queries/generalQueue";

function Dashboard() {
  const classrooms = useClassrooms(true);
  const [currentTime, setCurrentTime] = useState('');
  const {data: data, loading, error} = useQuery(GET_GENERAL_QUEUE);
  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
  });

  return (
    <div className={styles.wrapper}>
      <Header>
        <div className={styles.header}>
          <h1>Загальна черга</h1>
          <h2>{currentTime}</h2>
        </div>
      </Header>
      <div className={styles.containter}>
        <div>
          <ul className={styles.generalQueue}>
            {!loading && !error && data.generalQueue
              .slice(0, 10)
              .map((user: User, index: number) => (
              <li key={user.id}>
                <span>{index+1} </span>
                <span className={styles.fullName}>{fullName(user, true)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul>
          {classrooms && classrooms
            .filter(({occupied}) => occupied?.state === OccupiedState.PENDING)
            .map(classroom => (
              <li key={classroom.id}>
                <span>{classroom.name} </span>
                <span>{fullName(classroom.occupied!.user, true)}</span>
              </li>
              ))
          }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;