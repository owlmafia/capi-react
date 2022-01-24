import React, { useEffect } from "react";
import { init } from "./controller";

export const Stats = (props) => {
  useEffect(() => {
    init(props.statusMsg);
  }, [props.statusMsg]);

  return <div>{"TODO stats"}</div>;
};
