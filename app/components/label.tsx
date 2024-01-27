import classes from "./label.module.css";

interface CardLabelProps {
  label: string;
}

export function CardLabel({ label }: CardLabelProps) {
  return <span className={classes.label}>{label}</span>;
}
