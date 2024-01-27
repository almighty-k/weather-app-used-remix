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
  precip_in: number; // 降水確率
  humidity: number; // 湿度
  cloud: number; // 雲量
  is_day: number; // 昼間かどうか
  uv: number; // 紫外線指数
  gust_mph: number; // 突風（マイル毎時）
  gust_kph: number; // 突風（キロメートル毎時）
}

export interface CurrentResponse {
  location: Location;
  current: Current;
}
