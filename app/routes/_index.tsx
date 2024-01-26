import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("/weather_forecasts");
}
