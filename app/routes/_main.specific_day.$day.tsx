import { useParams } from "@remix-run/react";

import { ERROR_MESSAGES } from "../messages";
import { Title } from "../components/title";
import { getMonthAndDate } from "../utils";

export default function SpecificDay() {
  const { day } = useParams();
  if (!day) throw Error(ERROR_MESSAGES.invalidParam);

  const formattedDay = getMonthAndDate(day);
  return (
    <div>
      <Title title={formattedDay} />
    </div>
  );
}
