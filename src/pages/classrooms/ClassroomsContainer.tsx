import React, { useEffect, useState } from "react";
import Classrooms from "./Classrooms";
import { GET_CLASSROOMS } from "../../api/operations/queries/classrooms";
import { client } from "../../api/client";
import { ClassroomType } from "../../models/models";
type PropTypes = {};

const ClassroomsContainer: React.FC<PropTypes> = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .query({
        query: GET_CLASSROOMS,
        variables: { date: new Date().toString() },
      })
      .then((data) => {
        setLoading(data.loading);
        setClassrooms(
          data.data.classrooms
            .slice()
            .sort(
              (a: ClassroomType, b: ClassroomType) =>
                parseInt(a.name) - parseInt(b.name)
            )
        );
      });
  }, []);

  if (!loading)
    return (
      <div>
        <Classrooms classrooms={classrooms} />
      </div>
    );
  return <p>Loading</p>;
};

export default ClassroomsContainer;
