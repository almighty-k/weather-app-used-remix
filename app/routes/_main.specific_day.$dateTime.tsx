import classes from "../routes-styles/_main.specific_day.$dateTime.module.css";

import { Suspense } from "react";
import {
  Await,
  NavLink,
  defer,
  useLoaderData,
  useParams,
  useSearchParams
} from "@remix-run/react";
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
import { BackIcon } from "../components/icon";

export default function SpecificDay() {
  const { dateTime } = useParams();
  if (!dateTime) throw Error(ERROR_MESSAGES.invalidParam);

  const { weatherByDatePromise } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location") || "";
  // 30文字以上の場合はバリデーションエラーを表示
  const validationError =
    location.length > 30 ? "Please enter within 30 characters." : "";

  const formattedDay = getMonthAndDate(dateTime);
  return (
    <div>
      <div className={classes.titleContainer}>
        <NavLink
          to={`/weather_forecasts?location=${location}`}
          prefetch="intent"
          className={classes.backIcon}
        >
          <BackIcon />
        </NavLink>
        <Title title={formattedDay} />
        <div />
      </div>

      <div className={classes.searchInputContainer}>
        <SearchInput
          label="Location Input"
          name="location"
          error={validationError}
        />
      </div>

      <div className={classes.weatherByDateCardContainer}>
        <Suspense
          fallback={
            <NonWeatherByDateCard
              cardLabel={formattedDay}
              message="loading..."
            />
          }
        >
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
      <NonWeatherByDateCard
        cardLabel={labelMessage}
        message="Enter location for search."
      />
    );
  }
  if ("error" in weatherByDate) {
    if (weatherByDate.error.code === 1006) {
      return (
        <NonWeatherByDateCard
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
            <div key={forecast.time + index}>
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
                      label="Chance of Rain"
                      value={`${forecast.chance_of_rain}%`}
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

interface NonWeatherByDateCardProps {
  cardLabel: string;
  message: string;
}

function NonWeatherByDateCard({
  cardLabel,
  message
}: NonWeatherByDateCardProps) {
  return (
    <WeatherCard
      cardLabel={cardLabel}
      CardContent={<GuidanceMessage value={message} />}
    />
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { dateTime } = params;
  if (!dateTime) throw Error(ERROR_MESSAGES.invalidParam);

  const location = new URL(request.url).searchParams.get("location");
  if (!location) return defer({ weatherByDatePromise: null });
  if (location.length > 30)
    return defer({
      weatherByDatePromise: {
        error: {
          code: 1006,
          message: `${ERROR_MESSAGES.validationError}: location" length must be less than 30.`
        }
      }
    });

  const [date] = dateTime.split(" ");
  const weatherByDatePromise = fetchWeatherByDate({
    location,
    date
  });

  return defer({ weatherByDatePromise });
}
