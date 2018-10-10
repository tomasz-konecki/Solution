import React from "react";
import "./empty-content.scss";

const emptyContent = ({
  shouldShowTopIcon,
  sizeClass,
  operationIcon,
  content,
  mainIcon,
  action,
  children
}) => (
  <div onClick={action} className={`${sizeClass} empty-content-container`}>
    <div className="message-content-container">
      <p>{content}</p>
      <span>
        {shouldShowTopIcon && <i className={operationIcon} />}
        <i className={mainIcon} />
      </span>
    </div>
    {children}
  </div>
);

export default emptyContent;
