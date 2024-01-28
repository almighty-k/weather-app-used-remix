import classes from "./message.module.css";

interface GuidanceMessageProps {
  value: string;
}

export function GuidanceMessage({ value }: GuidanceMessageProps) {
  return <p className={classes.text}>{value}</p>;
}
