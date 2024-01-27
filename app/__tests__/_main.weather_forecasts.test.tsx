// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { CurrentWeatherCard } from "../routes/_main.weather_forecasts";
import { mockCurrentWeather } from "./mock";

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
