import React, { Fragment } from "react";

import spinner from "../images/loading.jpg";

const Spinner = () => {
  return (
    <Fragment>
      <img
        src={spinner}
        alt="loading..."
        styles={{ width: "50px", height: "50px" }}
      />
    </Fragment>
  );
};

export default Spinner;
