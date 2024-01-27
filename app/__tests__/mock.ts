import type { CurrentResponse } from "../api/api.types";

export const mockCurrentWeather: CurrentResponse = {
  location: {
    name: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    lat: 35.69,
    lon: 139.69,
    tz_id: "Asia/Tokyo",
    localtime_epoch: 1706335403,
    localtime: "2024-01-27 15:03"
  },
  current: {
    last_updated_epoch: 1706335200,
    last_updated: "2024-01-27 15:00",
    temp_c: 12,
    temp_f: 53.6,
    is_day: 1,
    condition: {
      text: "Sunny",
      icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
      code: 1000
    },
    wind_mph: 10.5,
    wind_kph: 16.9,
    wind_degree: 360,
    wind_dir: "N",
    pressure_mb: 1016,
    pressure_in: 30,
    precip_mm: 0,
    precip_in: 0,
    humidity: 22,
    cloud: 0,
    feelslike_c: 11.7,
    feelslike_f: 53,
    uv: 3,
    gust_mph: 15,
    gust_kph: 24.1
  }
};
