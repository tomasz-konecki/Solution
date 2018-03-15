import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as asyncActions from './../../../actions/asyncActions';
import LoaderHorizontal from './../LoaderHorizontal';
import ResultBlock from '../ResultBlock';
import { SET_ACTION_CONFIRMATION_RESULT } from '../../../constants';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successMessage: undefined,
      invalidated: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type === SET_ACTION_CONFIRMATION_RESULT){
      this.state.successMessage = this.props.toConfirm.successMessage;
    }
  }

  invalidate = () => {
    if(this.props.isWorking) return;
    this.props.async.setActionConfirmation(false);
  }

  confirm = () => {
    this.props.async.actionConfirmed(this.props.toConfirm);
  }

  hideAfterSuccess = () => {
    setTimeout(() => {
      this.invalidate();
    }, 1000);
  }

  isCompleted = () => {
    return this.props.resultBlock.response !== undefined;
  }

  render() {
    return (
      <div>
        <Modal
          open={this.props.shown}
          classNames={{ modal: "confirm-modal" }}
          contentLabel="Confirm action"
          onClose={this.invalidate}
        >
          {(!this.isCompleted()) &&
            <div>
              <div>You are about to:</div>
              <div>{this.props.toConfirm.string}</div>
              <div>Are you sure you want to perform this action?</div>
              <button onClick={this.confirm}>Yes</button>
              {this.props.isWorking && <LoaderHorizontal/>}
            </div>
          }
          {this.isCompleted() &&
            <ResultBlock
              errorBlock={this.props.resultBlock}
              errorOnly={false}
              successCallback={this.hideAfterSuccess}
              successMessage={this.state.successMessage}/>
          }
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shown: state.asyncReducer.confirmationInProgress,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    type: state.asyncReducer.type,
    resultBlock: state.asyncReducer.resultBlock
  };
}

function mapDispatchToProps(dispatch) {
  return {
    async: bindActionCreators(asyncActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
