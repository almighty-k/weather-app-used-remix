import type {
  APIError,
  CurrentResponse,
  ForecastResponse
} from "../api/api.types";

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

export const mockForecastWeather: ForecastResponse = {
  current: {
    last_updated: "2024-01-27 10:00",
    last_updated_epoch: 1700000000,
    temp_c: 23.5,
    temp_f: 74.3,
    feelslike_c: 24.0,
    feelslike_f: 75.2,
    condition: {
      text: "Sunny",
      icon: "https://example.com/sunny.png",
      code: 1000
    },
    wind_mph: 5.6,
    wind_kph: 9.0,
    wind_degree: 135,
    wind_dir: "SE",
    pressure_mb: 1010,
    pressure_in: 29.83,
    precip_mm: 0.0,
    precip_in: 0.0,
    humidity: 65,
    cloud: 0,
    is_day: 1,
    uv: 5,
    gust_mph: 7.2,
    gust_kph: 11.6
  },
  location: {
    lat: 35.6895,
    lon: 139.6917,
    name: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    tz_id: "Asia/Tokyo",
    localtime_epoch: 1700000000,
    localtime: "2024-01-27 19:00"
  },
  forecast: {
    forecastday: Array.from({ length: 9 }, (_, i) => ({
      date: `2024-01-${21 + i}`,
      date_epoch: 1700000000 + 86400 * i,
      day: {
        maxtemp_c: 25,
        maxtemp_f: 77,
        mintemp_c: 15,
        mintemp_f: 59,
        avgtemp_c: 20,
        avgtemp_f: 68,
        maxwind_mph: 10,
        maxwind_kph: 16,
        totalprecip_mm: 0.5 * i,
        totalprecip_in: 0.02 * i,
        totalsnow_cm: 0,
        avgvis_km: 10,
        avgvis_miles: 6,
        avghumidity: 70,
        daily_will_it_rain: i % 2,
        daily_chance_of_rain: 10 * i,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        condition: {
          text: "Partly cloudy",
          icon: "https://example.com/partly_cloudy.png",
          code: 1003
        },
        uv: 5
      },
      hour: [] // 9日分表示用のデータなので、hourは省略
    }))
  }
};

export const mockWeatherByDate: ForecastResponse = {
  current: {
    last_updated: "2024-01-27 10:00",
    last_updated_epoch: 1700000000,
    temp_c: 23.5,
    temp_f: 74.3,
    feelslike_c: 24.0,
    feelslike_f: 75.2,
    condition: {
      text: "Sunny",
      icon: "https://example.com/sunny.png",
      code: 1000
    },
    wind_mph: 5.6,
    wind_kph: 9.0,
    wind_degree: 135,
    wind_dir: "SE",
    pressure_mb: 1010,
    pressure_in: 29.83,
    precip_mm: 0.0,
    precip_in: 0.0,
    humidity: 65,
    cloud: 0,
    is_day: 1,
    uv: 5,
    gust_mph: 7.2,
    gust_kph: 11.6
  },
  location: {
    lat: 35.6895,
    lon: 139.6917,
    name: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    tz_id: "Asia/Tokyo",
    localtime_epoch: 1700000000,
    localtime: "2024-01-27 19:00"
  },
  forecast: {
    forecastday: [
      {
        date: "2024-01-27",
        date_epoch: 1700000000,
        hour: [
          {
            time_epoch: 1700000000,
            time: "2024-01-27 00:00",
            temp_c: 20,
            temp_f: 68,
            is_day: 0,
            condition: {
              text: "Partly cloudy",
              icon: "https://example.com/partly_cloudy.png",
              code: 1003
            },
            diff_rad: 0.0,
            snow_cm: 0.0,
            uv: 5.0,
            short_rad: 0.0,

            wind_mph: 5.6,
            wind_kph: 9.0,
            wind_degree: 135,
            wind_dir: "SE",
            pressure_mb: 1010,
            pressure_in: 29.83,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 65,
            cloud: 0,
            feelslike_c: 24.0,
            feelslike_f: 75.2,
            windchill_c: 20.0,
            windchill_f: 68.0,
            heatindex_c: 24.0,
            heatindex_f: 75.2,
            dewpoint_c: 15.0,
            dewpoint_f: 59.0,
            will_it_rain: 0,
            chance_of_rain: 0,
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 10.0,
            vis_miles: 6.0,
            gust_mph: 7.2,
            gust_kph: 11.6
          }
        ],
        day: {
          maxtemp_c: 25,
          maxtemp_f: 77,
          mintemp_c: 15,
          mintemp_f: 59,
          avgtemp_c: 20,
          avgtemp_f: 68,
          maxwind_mph: 10,
          maxwind_kph: 16,
          totalprecip_mm: 0.5,
          totalprecip_in: 0.02,
          totalsnow_cm: 0,
          avgvis_km: 10,
          avgvis_miles: 6,
          avghumidity: 70,
          daily_will_it_rain: 0,
          daily_chance_of_rain: 0,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: {
            text: "Partly cloudy",
            icon: "https://example.com/partly_cloudy.png",
            code: 1003
          },
          uv: 5
        }
      }
    ]
  }
};

const firstHourData = mockWeatherByDate.forecast.forecastday[0].hour[0];

for (let i = 1; i < 24; i++) {
  const newHourData = { ...firstHourData };
  newHourData.time = `2024-01-27 ${String(i).padStart(2, "0")}:00`;
  newHourData.time_epoch = firstHourData.time_epoch + i * 3600;
  mockWeatherByDate.forecast.forecastday[0].hour.push(newHourData);
}

export const mockNonExistentLocationError: APIError = {
  error: {
    code: 1006,
    message: "No matching location found."
  }
};
