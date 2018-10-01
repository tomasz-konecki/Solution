import React, { Component } from "react";
import Icon from "../../../common/Icon";
import Form from "../../../form/form";

class CallSkype extends Component {
  state = {
    editSkype: true
  };

  handleClick = () => {
    const editSkype = !this.state.editSkype;
    this.setState({ editSkype });
  };

  render() {
    const {
      updateSkypeIdResult,
      editSkypeFormItems,
      skypeIdAddLoading,
      editSkypeId,
      employee,
      t,
      canEditSkypeId
    } = this.props;

    return editSkypeFormItems[0].value ? (
      <div className="row skypeDiv">
        <a
          title={`${t("CallSkype")} ${editSkypeFormItems[0].value}`}
          className="skype col"
          href={"skype:" + editSkypeFormItems[0].value + "?add"}
        >
          <Icon icon="skype" iconType="fab" />
          <span className="skypeId">{editSkypeFormItems[0].value}</span>
        </a>
        {canEditSkypeId && (
          <React.Fragment>
            {!this.state.editSkype ? (
              <React.Fragment>
                <a className="pencilIcon" onClick={this.handleClick}>
                  <Icon icon="times-circle" className="col pencilIcon" />
                </a>
                <Form
                  onSubmit={editSkypeId}
                  formItems={editSkypeFormItems}
                  btnTitle={t("Save")}
                  isLoading={skypeIdAddLoading}
                  submitResult={{
                    status:
                      updateSkypeIdResult && updateSkypeIdResult.errorOccurred
                        ? !updateSkypeIdResult.errorOccurred()
                          ? true
                          : false
                        : null,
                    content:
                      updateSkypeIdResult && updateSkypeIdResult.errorOccurred
                        ? !updateSkypeIdResult.errorOccurred()
                          ? t("SkypeIdUpdated")
                          : updateSkypeIdResult &&
                            updateSkypeIdResult.getMostSignificantText()
                        : null
                  }}
                  enableButtonAfterTransactionEnd={true}
                />
              </React.Fragment>
            ) : (
              <a className="pencilIcon" onClick={this.handleClick}>
                <Icon icon="pencil-alt" className="col pencilIcon" />
              </a>
            )}
          </React.Fragment>
        )}
      </div>
    ) : (
      <div className="row skypeDiv">
        <a
          title={`${t("CallBusinessSkype")}`}
          className="skype col"
          href={"sip:<" + employee.email + ">"}
        >
          <span className="skypeId">
            {" "}
            <img
              src="/public/img/skypeforbusiness.jpeg"
              className="businessSkypeIcon"
            />
            Skype for Business
          </span>
        </a>
        {!this.state.editSkype ? (
          <React.Fragment>
            <a className="pencilIcon" onClick={this.handleClick}>
              <Icon icon="times-circle" className="col pencilIcon" />
            </a>
            <Form
              onSubmit={editSkypeId}
              formItems={editSkypeFormItems}
              btnTitle={t("Save")}
              isLoading={skypeIdAddLoading}
              submitResult={{
                status:
                  updateSkypeIdResult && updateSkypeIdResult.errorOccurred
                    ? !updateSkypeIdResult.errorOccurred()
                      ? true
                      : false
                    : null,
                content:
                  updateSkypeIdResult && updateSkypeIdResult.errorOccurred
                    ? !updateSkypeIdResult.errorOccurred()
                      ? t("SkypeIdUpdated")
                      : updateSkypeIdResult &&
                        updateSkypeIdResult.getMostSignificantText()
                    : null
              }}
              enableButtonAfterTransactionEnd={true}
            />
          </React.Fragment>
        ) : (
          <a className="pencilIcon" onClick={this.handleClick}>
            <Icon icon="pencil-alt" className="col pencilIcon" />
          </a>
        )}
      </div>
    );
  }
}

export default CallSkype;
