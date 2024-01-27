import classes from "./input.module.css";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function SearchInput({ label, ...props }: InputProps) {
  return (
    <div className={classes.wrapper}>
      <label htmlFor={props.id}>{label}</label>
      <input {...props} className={classes.input} />
    </div>
  );
}
