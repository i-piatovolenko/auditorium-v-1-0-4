import {useEffect, useState} from "react";
import {client} from "../api/client";
import {Department} from "../models/models";
import {GET_DEPARTMENTS} from "../api/operations/queries/departments";

const useDepartments = (): Array<Department> => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    client.query({query: GET_DEPARTMENTS}).then((data) => {
      setDepartments(data.data.departments
          .slice().sort((a: Department, b: Department) => a.id - b.id));
      });
  }, []);

  return departments;
};

export default useDepartments;