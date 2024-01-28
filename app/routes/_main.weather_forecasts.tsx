import classes from "../routes-styles/_main.weather_forecasts.module.css";

import { Suspense, useReducer } from "react";
import { SerializeFrom, defer } from "@vercel/remix";
import { Await, useLoaderData } from "@remix-run/react";

import { Title } from "../components/title";
import { SearchInput } from "../components/input";
import { CardLabel } from "../components/label";
import { InfoRow } from "../components/info-row";
import { fetchCurrentWeather, fetchForecastWeather } from "../api/api.server";
import { getMonthAndDate } from "../utils";

export default function WeatherForecasts() {
  const { currentWeatherPromise, forecastWeatherPromise } =
    useLoaderData<typeof loader>();
  return (
    <div>
      <Title title="Weather Forecasts App" />

      <div className={classes.searchInputContainer}>
        <SearchInput label="Location Input" />
      </div>

      <div className={classes.currentWeatherCardContainer}>
        {/* TODO: ローディングスケルトンの実装 */}
        <Suspense fallback={<p>loading...</p>}>
          <Await resolve={currentWeatherPromise}>
            {(resolvedValue) => (
              <CurrentWeatherCard currentWeather={resolvedValue} />
            )}
          </Await>
        </Suspense>
      </div>

      <div className={classes.forecastWeatherTableContainer}>
        {/* TODO: ローディングスケルトンの実装 */}
        <Suspense fallback={<p>loading...</p>}>
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
  const { location, current } = currentWeather;

  return (
    <div className={classes.currentWeatherCard}>
      <CardLabel label="Current Weather" />

      <div className={classes.currentWeatherLocation}>
        <div>
          <img src={current.condition.icon} alt="current weather icon" />
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
          <InfoRow label="Humidity" value={`${current.humidity}%`} />
        </li>
        <li>
          <InfoRow label="Feels Like" value={`${current.feelslike_c}°C`} />
        </li>
        <li>
          <InfoRow
            label="Chance of Precipitation"
            value={`${current.precip_in}%`}
          />
        </li>
        <li>
          <InfoRow label="Precipitation" value={`${current.precip_mm}mm`} />
        </li>
        <li>
          <InfoRow label="Wind Speed" value={`${current.wind_kph}km/h`} />
        </li>
        <li>
          <InfoRow label="Wind Direction" value={current.wind_dir} />
        </li>
        <li>
          <InfoRow label="Pressure" value={`${current.pressure_in} Inches`} />
        </li>
        <li>
          <InfoRow label="UV Index" value={<UvInfo uv={current.uv} />} />
        </li>
      </ul>
    </div>
  );
}

interface UvInfoProps {
  uv: Awaited<
    SerializeFrom<typeof loader>["currentWeatherPromise"]
  >["current"]["uv"];
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

interface ForecastWeatherTableProps {
  forecastWeather: Awaited<
    SerializeFrom<typeof loader>["forecastWeatherPromise"]
  >;
}

export function ForecastWeatherTable({
  forecastWeather
}: ForecastWeatherTableProps) {
  const [step, dispatchStep] = useReducer(stepReducer, "first");

  const { forecast } = forecastWeather;
  const filteredForecast = getFilteredForecastByStep({
    forecastDay: forecast.forecastday,
    step
  });

  return (
    <div>
      <button
        className={classes.forecastWeathersStepButton}
        disabled={step === "first"}
        onClick={() => {
          dispatchStep({ type: "prev" });
        }}
      >
        Before 3 days
      </button>

      <button
        className={classes.forecastWeathersStepButton}
        disabled={step === "last"}
        onClick={() => {
          dispatchStep({ type: "next" });
        }}
      >
        Next 3 days
      </button>

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
                <img
                  src={forecastday.day.condition.icon}
                  alt={`${forecastday.date} weather`}
                />
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
  forecastDay: Awaited<
    SerializeFrom<typeof loader>["forecastWeatherPromise"]
  >["forecast"]["forecastday"];
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

export async function loader() {
  // TODO: 検索クエリから都市名（または緯度、軽度）を取得するよう実装。一旦、固定値で東京を指定
  const location = "Tokyo";
  const currentWeatherPromise = fetchCurrentWeather({ location });
  const forecastWeatherPromise = fetchForecastWeather({
    location
  });

  return defer({
    currentWeatherPromise,
    forecastWeatherPromise
  });
}
