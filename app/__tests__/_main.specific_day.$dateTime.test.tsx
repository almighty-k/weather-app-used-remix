// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { BrowserRouter as Router } from "react-router-dom";
import { expect, test, afterEach, describe } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { WeatherByDateCard } from "../routes/_main.specific_day.$dateTime";
import { mockNonExistentLocationError, mockWeatherByDate } from "./mock";

afterEach(() => {
  cleanup();
});

describe("ある日付に対する天気情報の表示(WeatherByDateCardコンポーネント)に関するテスト", () => {
  test("00:00~23:00まで、24時間分のデータが取得できている", () => {
    render(
      <Router>
        <WeatherByDateCard day="2024-01-27" weatherByDate={mockWeatherByDate} />
      </Router>
    );

    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      expect(screen.getByText(timeString)).toBeInTheDocument();
    }
    // 24:00 が存在しないことを確認
    expect(screen.queryByText("24:00")).not.toBeInTheDocument();
  });

  test("存在しない場所を入力した際、現在の天気情報を表示する代わりに、「Non-existent location.」が表示される", () => {
    render(
      <Router>
        <WeatherByDateCard
          day="2024-01-27"
          weatherByDate={mockNonExistentLocationError}
        />
      </Router>
    );

    expect(screen.queryByText("00:00")).not.toBeInTheDocument();
    expect(screen.getByText("Non-existent location.")).toBeInTheDocument();
  });

  test("場所の入力がない場合、現在の天気情報を表示する代わりに、「Enter location for search.」が表示される", () => {
    render(
      <Router>
        <WeatherByDateCard day="2024-01-27" weatherByDate={null} />
      </Router>
    );

    expect(screen.queryByText("00:00")).not.toBeInTheDocument();
    expect(screen.getByText("Enter location for search.")).toBeInTheDocument();
  });
});
