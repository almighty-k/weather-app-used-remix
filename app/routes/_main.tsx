import classes from "~/routes-styles/_main.module.css";

import { Outlet } from "@remix-run/react";

export default function Main() {
  return (
    <div className={classes.wrapper}>
      <Outlet />
    </div>
  );
}
