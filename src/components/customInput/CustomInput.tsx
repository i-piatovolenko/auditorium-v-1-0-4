import React, {useState} from "react";
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
  withEyeSwitcher?: boolean
}

const CustomInput: React.FC<PropTypes> = ({
                                            label, name, id, placeholder,
                                            type = "text", theme = "light", value, onChange
                                            , withEyeSwitcher = false, ...props
                                          }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <>
        <label
          htmlFor={id}
          className={[styles.customLabel, styles[theme]].join(" ")}
        >
          {label}
          <input
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            className={[
              styles.customInput,
              theme === "light" ? styles.customInputLight : styles.customInputDark,
            ].join(" ")}
            type={withEyeSwitcher ? showPassword ? "text" : "password" : type}
            placeholder={placeholder}
            {...props}
          />
          {withEyeSwitcher && (
            <div className={styles.eye} onClick={() => setShowPassword(prevState => !prevState)}
              style={{opacity: showPassword ? 1 : .3}}
            >
              <svg version="1.1" width='24' height='24' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                   viewBox="0 0 512 512" fill='#fff'>
                <g>
                  <g>
                    <path d="M508.177,245.995C503.607,240.897,393.682,121,256,121S8.394,240.897,3.823,245.995c-5.098,5.698-5.098,14.312,0,20.01
			C8.394,271.103,118.32,391,256,391s247.606-119.897,252.177-124.995C513.274,260.307,513.274,251.693,508.177,245.995z M256,361
			c-57.891,0-105-47.109-105-105s47.109-105,105-105s105,47.109,105,105S313.891,361,256,361z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M271,226c0-15.09,7.491-28.365,18.887-36.53C279.661,184.235,268.255,181,256,181c-41.353,0-75,33.647-75,75
			c0,41.353,33.647,75,75,75c37.024,0,67.668-27.034,73.722-62.358C299.516,278.367,271,255.522,271,226z"/>
                  </g>
                </g>
              </svg>
            </div>
          )}
        </label>
      </>
    );
  }
;

export default CustomInput;
