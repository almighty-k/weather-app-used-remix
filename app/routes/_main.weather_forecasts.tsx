import classes from "../routes-styles/_main.weather_forecasts.module.css";

import { Suspense, useReducer } from "react";
import { LoaderFunctionArgs, SerializeFrom, defer } from "@vercel/remix";
import {
  Await,
  NavLink,
  useLoaderData,
  useSearchParams
} from "@remix-run/react";

import { Title } from "../components/title";
import { SearchInput } from "../components/input";
import { InfoRow } from "../components/info-row";
import { fetchCurrentWeather, fetchForecastWeather } from "../api/api.server";
import { getMonthAndDate } from "../utils";
import type { CurrentResponse, ForecastResponse } from "../api/api.types";
import { ERROR_MESSAGES } from "../messages";
import { StepButton } from "../components/button";
import { GuidanceMessage } from "../components/message";
import { WeatherCard } from "../components/card";

export default function WeatherForecasts() {
  const { currentWeatherPromise, forecastWeatherPromise } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  // 30文字以上の場合はバリデーションエラーを表示
  const validationError =
    location.length > 30 ? "Please enter within 30 characters." : "";

  return (
    <div>
      <Title title="Weather Forecasts App" />

      <div className={classes.searchInputContainer}>
        <SearchInput
          label="Location Input"
          name="location"
          error={validationError}
        />
      </div>

      <div className={classes.currentWeatherCardContainer}>
        <Suspense
          fallback={<NonCurrentWeatherCardContents message="loading..." />}
        >
          <Await resolve={currentWeatherPromise}>
            {(resolvedValue) => (
              <CurrentWeatherCard currentWeather={resolvedValue} />
            )}
          </Await>
        </Suspense>
      </div>

      <div className={classes.forecastWeatherTableContainer}>
        <Suspense fallback={<NonForecastWeatherTable />}>
          <Await resolve={forecastWeatherPromise}>
            {(resolvedValue) => (
              <ForecastWeatherTable forecastWeather={resolvedValue} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

interface CurrentWeatherCardProps {
  currentWeather: Awaited<
    SerializeFrom<typeof loader>["currentWeatherPromise"]
  >;
}

export function CurrentWeatherCard({
  currentWeather
}: CurrentWeatherCardProps) {
  const [searchParams] = useSearchParams();

  if (!currentWeather)
    return (
      <NonCurrentWeatherCardContents message="Enter location for search." />
    );

  if ("error" in currentWeather) {
    if (currentWeather.error.code === 1006) {
      return <NonCurrentWeatherCardContents message="Non-existent location." />;
    }
    throw Error(ERROR_MESSAGES.unexpected);
  }
  const { location, current } = currentWeather;

  return (
    <NavLink
      to={`/specific_day/${location.localtime}?location=${searchParams.get("location")}`}
      prefetch="intent"
    >
      <div className={classes.currentWeatherCardLink}>
        <WeatherCard
          cardLabel="Current Weather"
          CardContent={
            <>
              <div className={classes.currentWeatherLocation}>
                <div>
                  <img
                    src={current.condition.icon}
                    alt="current weather icon"
                  />
                </div>
                <div>
                  <p>
                    {location.localtime && (
                      <InfoRow label="Now" value={location.localtime} />
                    )}
                  </p>
                  <p>
                    <InfoRow label="Location" value={location.name} />
                  </p>
                </div>
              </div>

              <ul className={classes.currentWeatherInfoListWrapper}>
                <li>
                  <InfoRow label="Temperature" value={`${current.temp_c}°C`} />
                </li>
                <li>
                  <InfoRow
                    label="Feels Like"
                    value={`${current.feelslike_c}°C`}
                  />
                </li>
                <li>
                  <InfoRow label="Humidity" value={`${current.humidity}%`} />
                </li>
                <li>
                  <InfoRow
                    label="Precipitation"
                    value={`${current.precip_mm}mm`}
                  />
                </li>
                <li>
                  <InfoRow
                    label="Wind Speed"
                    value={`${current.wind_kph}km/h`}
                  />
                </li>
                <li>
                  <InfoRow label="Wind Direction" value={current.wind_dir} />
                </li>
                <li>
                  <InfoRow
                    label="Pressure"
                    value={`${current.pressure_in} Inches`}
                  />
                </li>
                <li>
                  <InfoRow
                    label="UV Index"
                    value={<UvInfo uv={current.uv} />}
                  />
                </li>
              </ul>
            </>
          }
        />
      </div>
    </NavLink>
  );
}

interface UvInfoProps {
  uv: CurrentResponse["current"]["uv"];
}

function UvInfo({ uv }: UvInfoProps) {
  if (uv <= 2) {
    return <span>Low</span>;
  }
  if (uv <= 5) {
    return <span>Moderate</span>;
  }
  if (uv <= 7) {
    return <span>High</span>;
  }
  return <span>Very High</span>;
}

interface NonCurrentWeatherCardContentsProps {
  message: string;
}

function NonCurrentWeatherCardContents({
  message
}: NonCurrentWeatherCardContentsProps) {
  return (
    <WeatherCard
      cardLabel="Current Weather"
      CardContent={<GuidanceMessage value={message} />}
    />
  );
}

interface ForecastWeatherTableProps {
  forecastWeather: Awaited<
    SerializeFrom<typeof loader>["forecastWeatherPromise"]
  >;
}

export function ForecastWeatherTable({
  forecastWeather
}: ForecastWeatherTableProps) {
  const [searchParams] = useSearchParams();
  const [step, dispatchStep] = useReducer(stepReducer, "first");

  if (!forecastWeather) {
    return <NonForecastWeatherTable />;
  }
  if ("error" in forecastWeather) {
    if (forecastWeather.error.code === 1006) {
      return <NonForecastWeatherTable />;
    }
    throw Error(ERROR_MESSAGES.unexpected);
  }

  const { forecast } = forecastWeather;
  const filteredForecast = getFilteredForecastByStep({
    forecastDay: forecast.forecastday,
    step
  });

  return (
    <div>
      <StepButton
        label="Before 3 days"
        disabled={step === "first"}
        onClick={() => {
          dispatchStep({ type: "prev" });
        }}
      />
      <StepButton
        label="Next 3 days"
        disabled={step === "last"}
        onClick={() => {
          dispatchStep({ type: "next" });
        }}
      />

      <table className={classes.forecastWeatherTable}>
        <thead>
          <tr>
            {filteredForecast.map((forecastday) => (
              <th key={forecastday.date}>
                {getMonthAndDate(forecastday.date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {filteredForecast.map((forecastday) => (
              <td key={forecastday.date}>
                <NavLink
                  to={`/specific_day/${forecastday.date}?location=${searchParams.get("location")}`}
                  prefetch="intent"
                >
                  <img
                    src={forecastday.day.condition.icon}
                    alt={`${forecastday.date} weather`}
                  />
                </NavLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type Step = "first" | "middle" | "last";

function stepReducer(state: Step, action: { type: "prev" | "next" }) {
  switch (action.type) {
    case "prev": {
      if (state === "middle") {
        return "first";
      }
      return "middle";
    }
    case "next": {
      if (state === "first") {
        return "middle";
      }
      return "last";
    }
    default: {
      throw Error("invalid action type");
    }
  }
}

/**
 * 各ステップ(first、middle、last)において表示する天気予報を取得する
 * なお、2colsとあるが、ワイヤフレーム上を優先し、3colsで表示する
 * @returns
 */
function getFilteredForecastByStep({
  forecastDay,
  step
}: {
  forecastDay: ForecastResponse["forecast"]["forecastday"];
  step: Step;
}) {
  if (step === "first") {
    return [...forecastDay.slice(0, 3)];
  }
  if (step === "middle") {
    return [...forecastDay.slice(3, 6)];
  }
  return [...forecastDay.slice(6)];
}

// コンポーネントと関数を見分けるため、空のpropsを定義
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NonForecastWeatherTableProps {}

function NonForecastWeatherTable() {
  return (
    <div>
      <StepButton label="Before 3 days" disabled />
      <StepButton label="Next 3 days" disabled />

      <table className={classes.forecastWeatherTable}>
        <thead>
          <tr>
            {Array.from({ length: 3 }).map((_, index) => (
              <th key={index} />
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {Array.from({ length: 3 }).map((_, index) => (
              <td key={index} />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const location = new URL(request.url).searchParams.get("location");
  if (!location)
    return defer({ currentWeatherPromise: null, forecastWeatherPromise: null });
  if (location.length > 30)
    return defer({
      currentWeatherPromise: {
        error: {
          code: 1006,
          message: `${ERROR_MESSAGES.validationError}: location" length must be less than 30.`
        }
      },
      forecastWeatherPromise: {
        error: {
          code: 1006,
          message: `${ERROR_MESSAGES.validationError}: location" length must be less than 30.`
        }
      }
    });

  const currentWeatherPromise = fetchCurrentWeather({ location });
  const forecastWeatherPromise = fetchForecastWeather({
    location
  });

  return defer({
    currentWeatherPromise,
    forecastWeatherPromise
  });
}
