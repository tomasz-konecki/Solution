import React from "react";
import { Route, withRouter  } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Content from "./content/Content";
import "../../scss/MainContainer.scss";
import PropTypes from 'prop-types';

class MainContainer extends React.Component {
  constructor(props, match) {
    super(props);

  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <div className="wrapper">
          <Header logout={this.props.logout}/>
          <Content match={match} />
        </div>
      </div>
    );
  }
}

MainContainer.propTypes = {
  match: PropTypes.object,
  logout: PropTypes.func
};

export default MainContainer;
