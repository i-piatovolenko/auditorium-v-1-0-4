import React from 'react';
import Select from "react-select";
import {selectStyles} from "./selectStyles";

const HeaderSelect = ({options, onChange}: any) => {
  return (
    <Select
    options={options}
    defaultValue={options[0]}
    styles={selectStyles}
    onChange={onChange}
    />
  );
}

export default HeaderSelect;