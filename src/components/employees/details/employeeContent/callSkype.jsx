import React, { Component } from "react";
import Icon from "../../../common/Icon";
import Form from "../../../form/form";
import SkypeId from "./skypeId";
import OperationStatusPrompt from '../../../form/operationStatusPrompt/operationStatusPrompt';
class CallSkype extends Component {
  state = {
    editSkype: true
  };

  handleClick = () => {
    const editSkype = !this.state.editSkype;
    this.setState({editSkype});
  };

  onSubmit = () => {
    this.props.editSkypeId();
    this.handleClick();
  }

  render() {
    const {
      updateSkypeIdResult,
      editSkypeFormItems,
      skypeIdAddLoading,
      employee,
      t,
      canEditSkypeId,
      updateSkypeResult
    } = this.props;
    const {editSkype} = this.state;

    return(
      <div className="row skypeDiv">
        {updateSkypeIdResult !== null &&
            <OperationStatusPrompt
              operationPromptContent={
                updateSkypeIdResult.replyBlock.status > 399 ? updateSkypeIdResult.getMostSignificantText() : t("SkypeIdUpdated")
              }
              operationPrompt={updateSkypeIdResult.replyBlock.status < 400 }
              closePrompt={updateSkypeResult}
            />
        }
        <SkypeId
            title={employee.skypeId ? `${t("CallSkype")} ${employee.skypeId}` : `${t("CallBusinessSkype")}`}
            href={employee.skypeId ? `skype:${employee.skypeId}?add` : `sip:<${employee.email}>`}
            employee={employee}
            hasId={!!employee.skypeId}
        />    
        {canEditSkypeId && (
          <React.Fragment>
            {!editSkype ? (
              <React.Fragment>{
                <a className="pencilIcon" title={t("Close")} onClick={this.handleClick}>
                  <Icon icon="times-circle" className="col pencilIcon" />
                </a>}
                <Form
                  onSubmit={this.onSubmit}
                  formItems={editSkypeFormItems}
                  btnTitle={t("Save")}
                  isLoading={skypeIdAddLoading}
                  enableButtonAfterTransactionEnd={true}
                  shouldSubmit={true}
                />
              </React.Fragment>
            ) : (
              <a className="pencilIcon" title={t("Edit")} onClick={this.handleClick}>
                <Icon icon="pencil-alt" className="col pencilIcon" />
              </a>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default CallSkype;
