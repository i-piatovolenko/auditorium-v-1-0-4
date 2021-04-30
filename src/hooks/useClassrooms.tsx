import React, {useEffect, useState} from "react";
import {client} from "../api/client";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ISODateString} from "../helpers/helpers";
import {ClassroomType} from "../models/models";
import {gql, useQuery} from "@apollo/client";
import {useNotification} from "../components/notification/NotificationProvider";

const useClassrooms = (props?: any): Array<ClassroomType> => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const dispatchNotification = useNotification();
  const { data } = useQuery(gql`
    query gridUpdate {
      gridUpdate @client
    }
  `);

  useEffect(() => {
    try {
      client
        .query({
          query: GET_CLASSROOMS,
          variables: {date: ISODateString(props?.date ? props.date : new Date())},
          fetchPolicy: 'network-only'
        })
        .then((data) => {
          setClassrooms(
            data.data.classrooms
              .slice()
              .sort(
                (a: ClassroomType, b: ClassroomType) =>
                  parseInt(a.name) - parseInt(b.name)
              )
          );
        });
    } catch (e) {
      console.log(e)
      dispatchNotification({
        header: "Помилка!",
        message: <><span>Щось пішло не так.</span><br/>
          <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline'}}>Деталі</span></>,
        type: "alert",
      });
    }

  }, [data.gridUpdate]);

  return classrooms;
};

export default useClassrooms;