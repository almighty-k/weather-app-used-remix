import classes from "./input.module.css";

import type { InputHTMLAttributes } from "react";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function SearchInput({ label, error, ...props }: InputProps) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  return (
    <Form
      className={classes.wrapper}
      onChange={(e) => {
        submit(e.currentTarget, { replace: true, preventScrollReset: true });
      }}
    >
      <label htmlFor={props.id}>{label}</label>
      <input
        id={props.id}
        name={props.name}
        placeholder="Input Example: tokyo or 35.6894,139.6917"
        defaultValue={searchParams.get("location") || ""}
        {...props}
        className={error ? classes.inputError : classes.input}
      />
      {error && <p className={classes.inputErrorMessage}>{error}</p>}
    </Form>
  );
}
