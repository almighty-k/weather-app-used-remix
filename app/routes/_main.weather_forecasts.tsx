import classes from "../routes-styles/_main.weather_forecasts.module.css";

import { Suspense } from "react";
import { SerializeFrom, defer } from "@vercel/remix";
import { Await, useLoaderData } from "@remix-run/react";

import { Title } from "../components/title";
import { SearchInput } from "../components/input";
import { CardLabel } from "../components/label";
import { InfoRow } from "../components/info-row";
import { fetchCurrentWeather } from "../api/api.server";

export default function WeatherForecasts() {
  const { currentWeatherPromise } = useLoaderData<typeof loader>();
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
    </div>
  );
}

interface CurrentWeatherCardProps {
  currentWeather: Awaited<
    SerializeFrom<typeof loader>["currentWeatherPromise"]
  >;
}

function CurrentWeatherCard({ currentWeather }: CurrentWeatherCardProps) {
  const { location, current } = currentWeather;

  return (
    <div className={classes.currentWeatherCard}>
      <CardLabel label="Current Weather" />

      <div className={classes.currentWeatherLocation}>
        <img src={current.condition.icon} alt="current weather icon" />
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
          <InfoRow label="Pressure" value={`${current.precip_in} Inches`} />
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

export async function loader() {
  // TODO: 検索クエリから都市名（または緯度、軽度）を取得するよう実装。一旦、固定値で東京を指定
  const location = "Tokyo";
  const currentWeatherPromise = fetchCurrentWeather({ location });
  return defer({
    currentWeatherPromise
  });
}
