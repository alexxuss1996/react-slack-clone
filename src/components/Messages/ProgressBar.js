import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) => {
  return (
    uploadState === "uploading" && (
      <Progress className="progress__bar" inverted indicating size="medium" percent={percentUploaded} progress />
    )
  );
};

export default ProgressBar;
