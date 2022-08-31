import {useEffect, useState} from "react";
import {client} from "../api/client";
import {InstrumentType} from "../models/models";
import {GET_INSTRUMENTS} from "../api/operations/queries/instruments";

const useInstruments = (updateList: boolean): Array<InstrumentType> => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);

  useEffect(() => {
    client.query({query: GET_INSTRUMENTS, variables: {
      where: {
      }
      },
      fetchPolicy: 'network-only'
    }).then((data) => {
        setInstruments(data.data.instruments
          .slice().sort((a: InstrumentType, b: InstrumentType) => a.id - b.id));
      });
  }, [updateList]);

  return instruments;
};

export default useInstruments;