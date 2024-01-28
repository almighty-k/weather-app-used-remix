interface Location {
  lat: number; // 緯度
  lon: number; // 経度
  name: string;
  region: string;
  country: string;
  tz_id?: string;
  localtime_epoch?: number;
  localtime?: string; // 現在日時
}

interface Condition {
  text: string; // 天候テキスト
  icon: string; // 天候アイコンurl
  code: number; // 天候コード
}

interface Current {
  last_updated: string;
  last_updated_epoch: number;
  temp_c: number; // 温度（摂氏）
  temp_f: number; // 温度（華氏）
  feelslike_c: number; // 体感温度（摂氏）
  feelslike_f: number; // 体感温度（華氏）
  condition: Condition;
  wind_mph: number; // 風速（マイル毎時）
  wind_kph: number; // 風速（キロメートル毎時）
  wind_degree: number; // 風向（度）
  wind_dir: string; // 風向（方角）
  pressure_mb: number; // 気圧（ミリバール）
  pressure_in: number; // 気圧（インチ）
  precip_mm: number; // 降水量（ミリメートル）
  precip_in: number; // 降水量（インチ）
  humidity: number; // 湿度
  cloud: number; // 雲量
  is_day: number; // 昼間かどうか
  uv: number; // 紫外線指数
  gust_mph: number; // 突風（マイル毎時）
  gust_kph: number; // 突風（キロメートル毎時）
}

interface Day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  will_it_snow: number;
  is_day: number;
  vis_km: number;
  vis_miles: number;
  chance_of_rain: number;
  chance_of_snow: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
  short_rad: number;
  diff_rad: number;
  // air_qualityについては、今回は使用しないため、型定義を省略
  // air_quality: AirQuality;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: Day;
  hour: Hour[];
  // astro使用せず、また膨大な型定義が必要なため、今回は省略
}

interface Forecast {
  forecastday: ForecastDay[];
}

export interface CurrentResponse {
  location: Location;
  current: Current;
}

export interface ForecastResponse {
  current: Current;
  location: Location;
  forecast: Forecast;
}

export interface APIError {
  error: {
    code: number;
    message: string;
  };
}
