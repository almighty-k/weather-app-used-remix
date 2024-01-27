import classes from "./title.module.css";

interface TitleProps {
  title: string;
}

export function Title({ title }: TitleProps) {
  return <h1 className={classes.title}>{title}</h1>;
}
