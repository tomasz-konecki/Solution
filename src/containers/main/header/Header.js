import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import Logo from "../../../components/common/Logo";
import TopBar from "./TopBar";
import Icon from "../../../components/common/Icon";
import LeftMenu from "../menu/LeftMenu";
import { browserHistory } from 'react-router';
import {Link} from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {extended: false, blocked: false};

    this.handleExtend = this.handleExtend.bind(this);
    this.handleBlockedClick = this.handleBlockedClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  componentDidMount() {
    this.props.history.listen(location =>  {
      this.closeMenu();
    });
  }

  closeMenu() {
    this.setState({
      extended: false
    });
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
        <div onClick={this.handleBlockedClick} className="extender menu-hide-exclusion">
          <Icon additionalClass="menu-hide-exclusion" icon="bars" iconSize="lg"/>
        </div>
        <LeftMenu className="left-menu" close={this.closeMenu} extended={this.state.extended} />
        <Link to="/main"> 
            <Logo size="vector_cut_header"/>
        </Link>
        <TopBar />
      </div>
    );
  }
}

Header.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Header);
