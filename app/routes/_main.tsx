import classes from "../routes-styles/_main.module.css";

import { Outlet } from "@remix-run/react";

export default function Main() {
  return (
    <>
      <div className={classes.wrapper}>
        <Outlet />
      </div>

      <p className={classes.credit}>
        Powered by{" "}
        <a href="https://www.weatherapi.com/" title="Free Weather API">
          WeatherAPI.com
        </a>
      </p>
    </>
  );
}
