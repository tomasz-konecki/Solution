import React, { Component } from "react";
import LoaderCircular from "./LoaderCircular";
import ResultBlock from "./ResultBlock";
import LoaderCube from "../common/loaders/LoaderCube";

const IntermediateBlock = ({
  loaded = false,
  render = () => {},
  resultBlock,
  _className,
  spinner = "Circular"
}) => {
  if (
    resultBlock === undefined ||
    resultBlock === null ||
    resultBlock.replyBlock.status === 200
  ) {
    if (loaded) return render();
  }
  let loader = <LoaderCircular />;
  switch (spinner) {
    case "Cube":
      loader = <LoaderCube />;
      break;
    case "Circular":
      loader = <LoaderCircular />;
      break;
    default:
      loader = <LoaderCircular />;
      break;
  }
  return (
    <div className="intermediate-block">
      {loaded ? (
        resultBlock.replyBlock.data === "" ? (
          resultBlock.replyBlock.data.ErrorOccurred ||
          resultBlock.replyBlock.data.errorOccurred ? (
            <div className={_className}>
              <ResultBlock errorBlock={resultBlock} />
            </div>
          ) : resultBlock.replyBlock.status !== 200 ? (
            <div className="api-error-message">
              <h1>
                {resultBlock.replyBlock.status} {resultBlock.message}
              </h1>
            </div>
          ) : (
            render()
          )
        ) : (
          <div className="api-error-message">
            <h1 style={{ color: "red" }}>Internal Server Error 500</h1>
            <img
              style={{ width: "100%" }}
              src="https://starecat.com/content/wp-content/uploads/500-internal-server-error-meanwhile-frontend-developer-cutting-grass-not-worried-about-it.jpg"
              alt="500"
            />
          </div>
        )
      ) : (
        <div className={_className}>{loader}</div>
      )}
    </div>
  );
};

export default IntermediateBlock;
