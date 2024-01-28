import classes from "~/root.module.css";

import { cssBundleHref } from "@remix-run/css-bundle";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@vercel/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Weather Forecasts App" },
    {
      name: "description",
      content:
        "It is an app that can check the weather forecast for the searched location."
    }
  ];
};

export const config = { runtime: "edge" };

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [])
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={classes.body}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
