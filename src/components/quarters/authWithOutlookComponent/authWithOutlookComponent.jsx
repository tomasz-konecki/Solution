import React from "react";
import { getEmployeeId as getQueryParam } from "../../../services/methods.js";
import { Redirect } from "react-router";
import LoadHandlingWrapper from "../../../hocs/handleLoadingContent";

class AuthWithOutlook extends React.PureComponent {
  state = {
    isAuthenticating: true
  };
  componentDidMount() {
    this.getTokenBySendingCode();
  }
  getTokenBySendingCode = () => {
    const {
      push,
      linkBeforeRedirectToOutlookAuth,
      sendAuthCodePromise,
      match
    } = this.props;
    const code = getQueryParam();
    if (code) {
      sendAuthCodePromise(window.location.href, true)
        .then(() => {
          push(linkBeforeRedirectToOutlookAuth);
        })
        .catch(() => {
          this.setState({ isAuthenticating: false });
        });
    }
  };

  render() {
    const { isAuthenticating } = this.state;
    const { authCodeStatus, authCodeErrors } = this.props;

    return (
      <LoadHandlingWrapper
        operationStatus={authCodeStatus}
        errors={authCodeErrors}
        closePrompt={this.getTokenBySendingCode}
        isLoading={isAuthenticating}
      >
        <span />
      </LoadHandlingWrapper>
    );
  }
}

export default AuthWithOutlook;
