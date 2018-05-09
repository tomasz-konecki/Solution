import React from 'react';

const DetailCascade = ({ lColSize, rColSize, lKey, rVal, defVal}) => {
  if(rVal === null || rVal === undefined) rVal = defVal;
  return <div className="row">
    <div className={'col-sm-' + lColSize}>{lKey}</div>
    <div className={'col-sm-' + rColSize}>{rVal}</div>
  </div>;
};

export default DetailCascade;
