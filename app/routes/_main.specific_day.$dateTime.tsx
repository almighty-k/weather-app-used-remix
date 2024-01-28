import classes from "../routes-styles/_main.specific_day.$dateTime.module.css";

import { Suspense } from "react";
import { Await, defer, useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom } from "@vercel/remix";

import { ERROR_MESSAGES } from "../messages";
import { Title } from "../components/title";
import { SearchInput } from "../components/input";
import { getMonthAndDate } from "../utils";
import { fetchWeatherByDate } from "../api/api.server";
import { WeatherCard } from "../components/card";
import { GuidanceMessage } from "../components/message";
import { InfoRow } from "../components/info-row";
import { Separator } from "../components/separator";

export default function SpecificDay() {
  const { dateTime } = useParams();
  if (!dateTime) throw Error(ERROR_MESSAGES.invalidParam);

  const { weatherByDatePromise } = useLoaderData<typeof loader>();

  const formattedDay = getMonthAndDate(dateTime);
  return (
    <div>
      <Title title={formattedDay} />

      <div className={classes.searchInputContainer}>
        <SearchInput label="Location Input" name="location" />
      </div>

      <div className={classes.weatherByDateCardContainer}>
        {/* TODO: ローディングスケルトンの実装 */}
        <Suspense fallback={<p>loading...</p>}>
          <Await resolve={weatherByDatePromise}>
            {(resolvedValue) => (
              <WeatherByDateCard
                day={formattedDay}
                weatherByDate={resolvedValue}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

interface WeatherByDateCardProps {
  day: string;
  weatherByDate: Awaited<SerializeFrom<typeof loader>["weatherByDatePromise"]>;
}

export function WeatherByDateCard({
  day,
  weatherByDate
}: WeatherByDateCardProps) {
  const labelMessage = `Weather at ${day}`;
  if (!weatherByDate) {
    return (
      <NonWeatherByDateCardContents
        cardLabel={labelMessage}
        message="Enter location for search."
      />
    );
  }
  if ("error" in weatherByDate) {
    if (weatherByDate.error.code === 1006) {
      return (
        <NonWeatherByDateCardContents
          cardLabel={labelMessage}
          message="Non-existent location."
        />
      );
    }
    throw Error(ERROR_MESSAGES.unexpected);
  }

  const forecastPerHour = weatherByDate.forecast.forecastday[0].hour;

  return (
    <WeatherCard
      cardLabel={`Weather at ${day}`}
      CardContent={
        <>
          {/* 24時間分表示するため、より重要と思われる「時間」「気温」「降水確率」のみを表示 */}
          {forecastPerHour.map((forecast, index) => (
            <div key={forecast.time}>
              <div className={classes.currentWeatherLocation}>
                <div>
                  <img
                    src={forecast.condition.icon}
                    alt="current weather icon"
                  />
                </div>
                <div>
                  <p>
                    <InfoRow label="Time" value={forecast.time.split(" ")[1]} />
                  </p>
                  <p>
                    <InfoRow
                      label="Temperature"
                      value={`${forecast.temp_c}°C`}
                    />
                  </p>
                  <p>
                    <InfoRow
                      label="Chance of Precipitation"
                      value={`${forecast.precip_in}%`}
                    />
                  </p>
                </div>
              </div>

              {index !== forecastPerHour.length - 1 && <Separator />}
            </div>
          ))}
        </>
      }
    />
  );
}

interface NonWeatherByDateCardContentsProps {
  cardLabel: string;
  message: string;
}

function NonWeatherByDateCardContents({
  cardLabel,
  message
}: NonWeatherByDateCardContentsProps) {
  return (
    <WeatherCard
      cardLabel={cardLabel}
      CardContent={<GuidanceMessage value={message} />}
    />
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { dateTime } = params;
  if (!dateTime) throw Error(ERROR_MESSAGES.invalidParam);

  const [date] = dateTime.split(" ");
  const weatherByDatePromise = fetchWeatherByDate({
    location: "Tokyo",
    date
  });

  return defer({ weatherByDatePromise });
}
