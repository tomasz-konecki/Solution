import React, { Component } from "react";
import "../../scss/components/usersModals/StageTwo.scss";
import FoundUsersTable from "../users/FoundUsersTable";

class StageTwo extends Component {
  constructor() {
    super();
    this.state = {
      show: ""
    };
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    this.props.resetState();
  }

  componentDidMount() {
    this.setState({ show: "stage-two-hide" });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      this.setState({
        show: this.props.isVisible ? "stage-two-hide" : "stage-two-show"
      });
    }
    // console.log("Stage Two, found users:", this.props.foundUsers);
  }

  render() {
    return (
      <div className={["stage-two-container", this.state.show].join(" ")}>
        {/* <FoundUsersTable foundUsers={this.props.foundUsers} /> */}
        <div className="button-back-container">
          <button onClick={this.handleBack}>Back</button>
        </div>
      </div>
    );
  }
}

export default StageTwo;
