// @vitest-environment jsdom
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { expect, test, afterEach, describe } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  CurrentWeatherCard,
  ForecastWeatherTable
} from "../routes/_main.weather_forecasts";
import {
  mockCurrentWeather,
  mockForecastWeather,
  mockNonExistentLocationError
} from "./mock";

afterEach(() => {
  cleanup();
});

describe("現在天気(CurrentWeatherCardコンポーネント)に関するテスト", () => {
  test("現在天気の取得値表示が適切である", () => {
    render(
      // useSearchParamsを使用しているため、Routerで囲む
      <Router>
        <CurrentWeatherCard currentWeather={mockCurrentWeather} />
      </Router>
    );

    expect(screen.getByText("Now:")).toBeInTheDocument();
    expect(screen.getByText("2024-01-27 15:03")).toBeInTheDocument();

    expect(screen.getByText("Location:")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();

    expect(screen.getByText("Temperature:")).toBeInTheDocument();
    expect(screen.getByText("12°C")).toBeInTheDocument();

    expect(screen.getByText("Feels Like:")).toBeInTheDocument();
    expect(screen.getByText("11.7°C")).toBeInTheDocument();

    expect(screen.getByText("Humidity:")).toBeInTheDocument();
    expect(screen.getByText("22%")).toBeInTheDocument();

    expect(screen.getByText("Precipitation:")).toBeInTheDocument();
    expect(screen.getByText("0mm")).toBeInTheDocument();

    expect(screen.getByText("Wind Speed:")).toBeInTheDocument();
    expect(screen.getByText("16.9km/h")).toBeInTheDocument();

    expect(screen.getByText("Wind Direction:")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();

    expect(screen.getByText("Pressure:")).toBeInTheDocument();
    expect(screen.getByText("30 Inches")).toBeInTheDocument();

    expect(screen.getByText("UV Index:")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  test("存在しない場所を入力した際、現在の天気情報を表示する代わりに、「Non-existent location.」が表示される", () => {
    render(
      <Router>
        <CurrentWeatherCard currentWeather={mockNonExistentLocationError} />
      </Router>
    );

    // 情報がある場合に表示される要素の確認として、Now:が存在しないことを確認（他の要素は省略）
    expect(screen.queryByText("Now:")).not.toBeInTheDocument();
    expect(screen.getByText("Non-existent location.")).toBeInTheDocument();
  });

  test("場所の入力がない場合、現在の天気情報を表示する代わりに、「Enter location for search.」が表示される", () => {
    render(
      <Router>
        <CurrentWeatherCard currentWeather={null} />
      </Router>
    );

    expect(screen.queryByText("Now:")).not.toBeInTheDocument();
    expect(screen.getByText("Enter location for search.")).toBeInTheDocument();
  });
});

describe("予報天気(ForecastWeatherTableコンポーネント)に関するテスト", () => {
  const user = userEvent.setup();

  const prevButtonName = "Before 3 days";
  const nextButtonName = "Next 3 days";
  const days = [
    "21/01",
    "22/01",
    "23/01",
    "24/01",
    "25/01",
    "26/01",
    "27/01",
    "28/01",
    "29/01"
  ];

  test("予報天気の取得値表示が適切で、stepボタン選択の際の表示切り替えが適切である", async () => {
    render(
      <Router>
        <ForecastWeatherTable forecastWeather={mockForecastWeather} />
      </Router>
    );

    expect(screen.getByRole("button", { name: prevButtonName })).toBeDisabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeEnabled();

    // それぞれのstepの代表的な1つの日付(各stepの最初の日付)のみを確認
    expect(
      screen.getByRole("columnheader", {
        name: days[0]
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: days[3]
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: days[6]
      })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: nextButtonName }));
    expect(screen.getByRole("button", { name: prevButtonName })).toBeEnabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeEnabled();

    expect(
      screen.queryByRole("columnheader", {
        name: days[0]
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: days[3]
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: days[6]
      })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: nextButtonName }));
    expect(screen.getByRole("button", { name: prevButtonName })).toBeEnabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeDisabled();

    expect(
      screen.queryByRole("columnheader", {
        name: days[0]
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: days[3]
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: days[6]
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: prevButtonName }));
    expect(screen.getByRole("button", { name: prevButtonName })).toBeEnabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeEnabled();

    expect(
      screen.queryByRole("columnheader", {
        name: days[0]
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: days[3]
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: days[6]
      })
    ).not.toBeInTheDocument();
  });

  test("存在しない場所を入力した際、予報天気切り替えの「Before 3 days」「After 3 days」は操作できない", () => {
    render(
      <Router>
        <ForecastWeatherTable forecastWeather={mockNonExistentLocationError} />
      </Router>
    );

    expect(screen.getByRole("button", { name: prevButtonName })).toBeDisabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeDisabled();
  });

  test("場所の入力がない場合、予報天気切り替えの「Before 3 days」「After 3 days」は操作できない", () => {
    render(
      <Router>
        <ForecastWeatherTable forecastWeather={null} />
      </Router>
    );

    expect(screen.getByRole("button", { name: prevButtonName })).toBeDisabled();
    expect(screen.getByRole("button", { name: nextButtonName })).toBeDisabled();
  });
});
