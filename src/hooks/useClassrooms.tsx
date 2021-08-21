import {useEffect, useState} from "react";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ClassroomType} from "../models/models";
import {useQuery} from "@apollo/client";
import moment from "moment";

const useClassrooms = (props?: any): [Array<ClassroomType>, any] => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const {data, loading, error, subscribeToMore} = useQuery(GET_CLASSROOMS, {
    variables: { date: moment(props?.date || new Date()).toISOString() }
  });

  useEffect(() => {
    !loading && !error && setClassrooms(
      data.classrooms
        .slice()
        .sort(
          (a: ClassroomType, b: ClassroomType) =>
            parseInt(a.name) - parseInt(b.name)
        )
    );
}, [data, loading, error]);

  return [classrooms, subscribeToMore];
};

export default useClassrooms;