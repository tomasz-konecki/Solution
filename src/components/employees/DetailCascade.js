import React from 'react';

const DetailCascade = ({ lColSize, rColSize, lKey, rVal, defVal, dHref}) => {
  if(rVal === null || rVal === undefined) rVal = defVal;
  if(dHref !== undefined) {
    return <div className="row">
      <div className={'col-sm-' + lColSize}>{lKey}</div>
      <div className={'col-sm-' + rColSize}><a href={dHref}>{rVal}</a></div>
    </div>;
  }
  return <div className="row">
    <div className={'col-sm-' + lColSize}>{lKey}</div>
    <div className={'col-sm-' + rColSize}>{rVal}</div>
  </div>;
};

export default DetailCascade;
