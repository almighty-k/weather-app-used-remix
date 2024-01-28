import classes from "./card.module.css";

import type { ReactNode } from "react";

interface WeatherCardProps {
  cardLabel: string;
  CardContent: ReactNode;
}

export function WeatherCard({ cardLabel, CardContent }: WeatherCardProps) {
  return (
    <div className={classes.weatherCard}>
      <CardLabel label={cardLabel} />
      {CardContent}
    </div>
  );
}

interface CardLabelProps {
  label: string;
}

function CardLabel({ label }: CardLabelProps) {
  return <span className={classes.label}>{label}</span>;
}
