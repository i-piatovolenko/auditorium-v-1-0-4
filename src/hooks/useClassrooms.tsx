import {useEffect, useState} from "react";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ClassroomType} from "../models/models";
import {useQuery} from "@apollo/client";

const useClassrooms = (): [Array<ClassroomType>, any] => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const {data, loading, error, subscribeToMore} = useQuery(GET_CLASSROOMS);

  useEffect(() => {
    // if(error && JSON.stringify(error).includes('BAD_TOKEN')) handleLogout();
    !loading && !error && setClassrooms(
      data.classrooms
        .slice()
        .sort(
          (a: ClassroomType, b: ClassroomType) =>
            a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'})
        )
    );
}, [data, loading, error]);

  return [classrooms, subscribeToMore];
};

export default useClassrooms;