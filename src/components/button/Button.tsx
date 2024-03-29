import React, {CSSProperties} from "react";
import styles from "./button.module.css";

interface PropTypes {
  onClick?: (e: any) => any;
  kind?: "default" | "primary";
  type?: "button" | "submit" | "reset";
  color?: "white" | "blue" | "red" | "orange";
  disabled?: boolean;
  style?: CSSProperties | undefined;
  form?: string;
  title?: string;
}

const Button: React.FC<PropTypes> = ({
  children,
  onClick,
  kind = "primary",
  type = "button",
  color = "blue",
  disabled = false,
  style = undefined,
  form= "",
  title,
}) => {
  return (
    <button
      title={title}
      form={form}
      style={style}
      disabled={disabled}
      type={type}
      className={[
        styles.button,
        kind === "primary" && styles[color],
        styles[type], !style && styles.sizes
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
