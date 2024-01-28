// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  CurrentWeatherCard,
  ForecastWeatherTable
} from "../routes/_main.weather_forecasts";
import { mockCurrentWeather, mockForecastWeather } from "./mock";

test("現在天気の取得値表示が適切である", async () => {
  render(<CurrentWeatherCard currentWeather={mockCurrentWeather} />);

  expect(screen.getByText("Now:")).toBeInTheDocument();
  expect(screen.getByText("2024-01-27 15:03")).toBeInTheDocument();

  expect(screen.getByText("Location:")).toBeInTheDocument();
  expect(screen.getByText("Tokyo")).toBeInTheDocument();

  expect(screen.getByText("Temperature:")).toBeInTheDocument();
  expect(screen.getByText("12°C")).toBeInTheDocument();

  expect(screen.getByText("Humidity:")).toBeInTheDocument();
  expect(screen.getByText("22%")).toBeInTheDocument();

  expect(screen.getByText("Feels Like:")).toBeInTheDocument();
  expect(screen.getByText("11.7°C")).toBeInTheDocument();

  expect(screen.getByText("Chance of Precipitation:")).toBeInTheDocument();
  expect(screen.getByText("0%")).toBeInTheDocument();

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

test("予報天気の取得値表示が適切で、stepボタン選択の際の表示切り替えが適切である", async () => {
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
  render(<ForecastWeatherTable forecastWeather={mockForecastWeather} />);

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
