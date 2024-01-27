import type { ReactNode } from "react";

import classes from "./info-row.module.css";

interface InfoRowProps {
  label: string;
  value: string | ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <>
      {label}: <span className={classes.value}>{value}</span>
    </>
  );
}
