import { API_ENDPOINT } from "~/config.server";
import type { CurrentResponse } from "./api.types";

export async function fetchCurrentWeather({
  location
}: {
  location: string;
}): Promise<CurrentResponse> {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${process.env.WHETHER_API_KEY}&q=${location}`
  );
  return await res.json();
}
