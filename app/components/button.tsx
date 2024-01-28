import classes from "./button.module.css";

import type { ButtonHTMLAttributes } from "react";

interface StepButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function StepButton({ label, ...props }: StepButton) {
  return (
    <button className={classes.button} {...props}>
      {label}
    </button>
  );
}
