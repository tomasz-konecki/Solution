import React, { Component } from 'react';
import LoaderCircular from './LoaderCircular';
import ResultBlock from './ResultBlock';

const IntermediateBlock = ({
  loaded = false,
  render = (() => {}),
  resultBlock,
  _className
}) => {
  if(resultBlock === undefined || resultBlock === null || resultBlock.replyBlock.status === 200){
    if(loaded) return render();
  }
  return <div className="intermediate-block">
    {
      loaded ?
      resultBlock.replyBlock.data.ErrorOccurred || resultBlock.replyBlock.data.errorOccurred ? <div className={_className}><ResultBlock errorBlock={resultBlock} /></div>
      : render()
      : <div className={_className}><LoaderCircular /></div>
    }
  </div>;
};

export default IntermediateBlock;
