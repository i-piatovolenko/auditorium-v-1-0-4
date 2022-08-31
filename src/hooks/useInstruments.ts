import {useEffect, useState} from "react";
import {client} from "../api/client";
import {InstrumentType} from "../models/models";
import {GET_INSTRUMENTS} from "../api/operations/queries/instruments";

const useInstruments = (): Array<InstrumentType> => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);

  useEffect(() => {
    client.query({
      query: GET_INSTRUMENTS,
      fetchPolicy: 'network-only'
    }).then((data) => {
      setInstruments(data.data.instruments
        .slice().sort((a: InstrumentType, b: InstrumentType) => a.id - b.id));
    });
  }, []);

  return instruments;
};

export default useInstruments;