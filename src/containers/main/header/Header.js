import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import Logo from "../../../components/common/Logo";
import TopBar from "./TopBar";
import Icon from "../../../components/common/Icon";
import LeftMenu from "../menu/LeftMenu";
import { browserHistory } from 'react-router';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {extended: false, blocked: false};

    this.handleExtend = this.handleExtend.bind(this);
    this.handleBlockedClick = this.handleBlockedClick.bind(this);

    if(window.outerWidth <= 1366){
      props.history.listen(location =>  {
        this.setState({
          extended: false
        });
      });
    }
  }

  handleExtend() {
    if(this.state.blocked) return;
    this.setState(prevState => ({
      extended: !prevState.extended
    }));
  }

  handleBlockedClick() {
    this.setState(prevState => ({
      blocked: !prevState.blocked,
      extended: !prevState.extended
    }));
  }

  render() {
    return (
      <div className="header">
        <div className="first-bar"/>
        <div className="second-bar"/>
        <div onClick={this.handleBlockedClick} className="extender">
          <Icon icon="bars" iconSize="lg"/>
        </div>
        <LeftMenu className="left-menu" extended={this.state.extended} />
        <Logo size="vector_cut"/>
        <div className="title">DCMT</div>
        <TopBar logout={this.props.logout} />
      </div>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func
};

export default withRouter(Header);
