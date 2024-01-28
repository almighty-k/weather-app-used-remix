import { API_ENDPOINT } from "../config.server";
import type { APIError, CurrentResponse, ForecastResponse } from "./api.types";

export async function fetchCurrentWeather({
  location
}: {
  location: string;
}): Promise<CurrentResponse | APIError> {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${process.env.WHETHER_API_KEY}&q=${location}`
  );
  return await res.json();
}

export async function fetchForecastWeather({
  location,
  days = 9 // 1週間分という仕様だが、9日分あっても困らないのと、3日ずつ表示する際にUI崩れをふせぐために9日分取得する
}: {
  location: string;
  days?: number;
}): Promise<ForecastResponse | APIError> {
  const res = await fetch(
    `${API_ENDPOINT}/forecast.json?key=${process.env.WHETHER_API_KEY}&q=${location}&days=${days}`
  );
  return await res.json();
}

export async function fetchWeatherByDate({
  location,
  date
}: {
  location: string;
  date: string;
}): Promise<ForecastResponse | APIError> {
  const res = await fetch(
    `${API_ENDPOINT}/forecast.json?key=${process.env.WHETHER_API_KEY}&q=${location}&dt=${date}`
  );
  return await res.json();
}
