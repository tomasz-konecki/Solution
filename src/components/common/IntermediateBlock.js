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
        resultBlock.replyBlock.data.ErrorOccurred ||
        resultBlock.replyBlock.data.errorOccurred ? (
          <div className={_className}>
            <ResultBlock errorBlock={resultBlock} />
          </div>
        ) : (
          render()
        )
      ) : (
        <div className={_className}>{loader}</div>
      )}
    </div>
  );
};

export default IntermediateBlock;
