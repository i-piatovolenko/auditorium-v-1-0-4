import React from "react";
import styles from "./customInput.module.css";

interface PropTypes {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  type?: string;
  theme?: "dark" | "light";
  value?: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<PropTypes> = ({label, name, id, placeholder,
    type = "text", theme = "light", value, onChange
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className={[styles.customLabel, styles[theme]].join(" ")}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        className={[
          styles.customInput,
          theme === "light" ? styles.customInputLight : styles.customInputDark,
        ].join(" ")}
        type={type}
        placeholder={placeholder}
      />
    </>
  );
};

export default CustomInput;
