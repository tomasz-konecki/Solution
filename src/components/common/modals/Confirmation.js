import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as asyncActions from './../../../actions/asyncActions';
import LoaderHorizontal from './../LoaderHorizontal';
import ResultBlock from '../ResultBlock';
import { SET_ACTION_CONFIRMATION_RESULT } from '../../../constants';
import { SET_ACTION_CONFIRMATION } from './../../../constants';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toConfirm: {},
      invalidated: false,
      resultBlock: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type === SET_ACTION_CONFIRMATION_RESULT){
      this.state.resultBlock = nextProps.resultBlock;
      this.hideAfterSuccess();
    }
    if(nextProps.type === SET_ACTION_CONFIRMATION && !(this.props.shown)){
      this.state.resultBlock = {};
      this.state.toConfirm = {};
    }
    if(nextProps.type === SET_ACTION_CONFIRMATION && nextProps.shown){
      this.state.toConfirm = nextProps.toConfirm;
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
    }, 2000);
  }

  isCompleted = () => {
    return this.state.resultBlock.response !== undefined;
  }

  render() {
    return (
      <div>
        <Modal
          open={this.props.shown}
          classNames={{ modal: "Modal" }}
          contentLabel="Confirm action"
          onClose={this.invalidate}
        >
          {(!this.isCompleted()) &&
            <div className="result-modal-container">
              <div className="result-about-to">You are about to:</div>
              <div className="result-string">{this.state.toConfirm.string}</div>
              <div className="result-confirmation">Are you sure you want to perform this action?</div>
              <div className="result-confirmation">It might be irreversible</div>
              <button className="result-confirm-button" onClick={this.confirm}>Yes</button>
              <div className="result-loader-container">{this.props.isWorking && <LoaderHorizontal/>}</div>
            </div>
          }
          {this.isCompleted() &&
            <div className="result-block-container">
              <ResultBlock
                errorBlock={this.state.resultBlock}
                errorOnly={false}
                successMessage={this.state.toConfirm.successMessage}/>
            </div>
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
