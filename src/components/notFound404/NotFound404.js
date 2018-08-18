import React, { Component } from "react";
import { translate } from "react-translate";
import { connect } from "react-redux";
import { CSSTransitionGroup } from "react-transition-group";
import "./NotFound404.scss";

class NotFound404 extends Component {
  state = {
    show: false
  };

  render() {
    const { t } = this.props;
    const content = (
      <div id="not-found-container">
        <div id="not-found-header">
          <div className="not-found-header-icon">
            <div className="vector_cut" />
          </div>
          <div className="not-found-header-text">
            <h1>404 {t("PageNotFound")}</h1>
            <hr />
            <p>{t("PageNotFoundText")}</p>
          </div>
        </div>
      </div>
    );

    return <React.Fragment>{content}</React.Fragment>;
  }
}
export default connect()(translate("NotFound404")(NotFound404));
