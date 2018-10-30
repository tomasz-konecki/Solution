import React, { Component } from "react";
import Icon from "../../../common/Icon";
import Form from "../../../form/form";
import SkypeId from "./skypeId";
import OperationStatusPrompt from '../../../form/operationStatusPrompt/operationStatusPrompt';
class CallSkype extends Component {
  state = {
    editSkype: true,
    isDisabled: false,
    promptOpen: false
  };

  handleClick = () => {
    const editSkype = !this.state.editSkype;
    this.setState({ editSkype });
  };

   onClickPrompt = () => {
    const {promptOpen} = this.state;
     this.setState({promptOpen: !promptOpen})
   }

  componentDidUdpate(prevProps){
    const { updateSkypeIdResult } = this.props;
    if(prevProps.updateSkypeIdResult !== updateSkypeIdResult){
        this.setState({isDisabled: !isDisabled});
    }
  }
  onSubmit = () => {
    this.props.editSkypeId();
    const isDisabled = !this.state.isDisabled;
    this.setState({isDisabled})
    console.log(this.props.updateSkypeIdResult)
    this.handleClick();
    setTimeout(() => {
        this.onClickPrompt()
    },4000)
  }

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
    const {isDisabled, editSkype} = this.state;

    console.log(updateSkypeIdResult ? updateSkypeIdResult : '')
    return(
      <div className="row skypeDiv">
        {updateSkypeIdResult !== null &&
            <OperationStatusPrompt
              operationPromptContent={
                updateSkypeIdResult.replyBlock.status > 399 ? updateSkypeIdResult.getMostSignificantText() : t("SkypeIdUpdated")
              }
              operationPrompt={!updateSkypeIdResult.replyBlock.status > 399 }
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
              <React.Fragment>{!isDisabled &&
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
                  isDisabled={isDisabled}
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
