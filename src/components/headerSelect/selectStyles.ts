import {StylesConfig} from "react-select";

export type CategoryType = {
  value: string;
  label: string;
};

type isMulti = false;

export const selectStyles: StylesConfig<CategoryType, isMulti> = ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#2e287c',
    border: '1px solid #fff',
    borderRadius: 8,
    width: 160,
    color: '#fff',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  menuList: (provided) => ({
    ...provided,
    color: '#000',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  indicatorSeparator: () => ({display: 'none'})
});

export const selectLightStyles: StylesConfig<CategoryType, isMulti> = ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    border: '1px solid #2e287c',
    borderRadius: 8,
    color: '#000',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ccc',
  }),
  menuList: (provided) => ({
    ...provided,
    color: '#000',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000',
  }),
  indicatorSeparator: () => ({display: 'none'}),
  menuPortal: base => ({...base, zIndex: 9999})
});