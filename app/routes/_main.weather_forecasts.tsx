import { defer } from "@vercel/remix";

import type { CurrentResponse } from "~/api.types";
import { API_ENDPOINT } from "~/config.server";

export default function WeatherForecasts() {
  return <p>週間天気予報ページ</p>;
}

export async function loader() {
  // TODO: 検索クエリから都市名（または緯度、軽度）を取得するよう実装。一旦、固定値で東京を指定
  const location = "Tokyo";
  const currentWeatherPromise = fetchCurrentWeather({ location });
  return defer({
    currentWeatherPromise
  });
}

async function fetchCurrentWeather({
  location
}: {
  location: string;
}): Promise<CurrentResponse> {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${process.env.WHETHER_API_KEY}&q=${location}`
  );
  return await res.json();
}
