import React, { Component } from "react";
import "./table.scss";
import moment from "moment";
import Hoc from "../../../services/auxilary";
import Modal from "react-responsive-modal";
import Form from "components/form/form";
import { connect } from "react-redux";
import {
  addFeedbackACreator,
  getFeedbacksACreator,
  addFeedback,
  getFeedbacks,
  editFeedback,
  editFeedbackACreator,
  deleteFeedback,
  deleteFeedbackACreator
} from "../../../actions/projectsActions";
import Spinner from "components/common/spinner/spinner";
import OperationStatusPrompt from "../../form/operationStatusPrompt/operationStatusPrompt";
import { withRouter } from "react-router-dom";
import { translate } from "react-translate";
import smallSpinner from "../spinner/small-spinner";

class Table extends Component {
  state = {
    trs: [],
    currentTrs: [],
    currentOpenedRowId: null,
    currentEditedFeedbackId: null,
    isFeedbackLoaded: false,
    opinionModal: false,
    modalType: false,
    modalEdit: false,
    deleteFeedbackSpinner: false,
    addFeedbackItems: [
      {
        title: this.props.t("Feedback"),
        type: "text",
        placeholder: this.props.t("AddFeedbackPlaceholder"),
        mode: "textarea",
        value: "",
        error: "",
        inputType: null,
        minLength: 3,
        maxLength: 1500,
        canBeNull: false
      }
    ],
    feedbackItems: [
      {
        title: this.props.t("Feedback"),
        type: "text",
        placeholder: this.props.t("AddFeedbackPlaceholder"),
        mode: "textarea",
        value: "",
        error: "",
        inputType: null,
        minLength: 3,
        maxLength: 1500,
        canBeNull: false
      }
    ],
    isLoading: false,
    helpData: []
  };
  componentDidMount() {
    const trs = this.populateTrs(this.props.items, this.props.t);
    this.setState({ trs: trs, currentTrs: trs });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      const trs = this.populateTrs(nextProps.items, nextProps.t);
      this.setState({ trs: trs, currentTrs: trs, isLoading: false });
    } else if (
      nextProps.addFeedbackErrors !== this.props.addFeedbackErrors ||
      nextProps.loadFeedbackErrors !== this.props.loadFeedbackError
    ) {
      this.setState({ isLoading: false });
    }
  }
  closeCurrentOpenedRow = () => {
    const currentTrs = [...this.state.currentTrs];
    for (let i = 0; i < currentTrs.length; i++)
      if (currentTrs[i].key === "uniq") {
        currentTrs.splice(i, 1);
        break;
      }

    this.setState({ currentTrs: currentTrs, currentOpenedRowId: null, isFeedbackLoaded: false });
  };

  pushUserDetailsIntoTableDOM = (id, t) => {
    const { currentOpenedRowId, trs } = this.state;
    if (
      currentOpenedRowId !== null &&
      id === currentOpenedRowId
    )
    this.closeCurrentOpenedRow();
    else {
      const teamRows = [];
      for (let i = 0; i <= id; i++) {
        teamRows.push(trs[i]);
      }
      const { items, history, canEditFeedbacks, isDeveloper, projectId, onlyActiveAssignments } = this.props;
      console.log(items)
      teamRows.push(
        <tr key="uniq" className="detail-table-header">
          <td>
            <ul className="detail-team-list">
              <h5>
                <span>
                  {items[id].email}
                  <i  title={t("GoIntoEmployeeDetails")}
                      onClick={() => history.push(`/main/employees/${items[id].employeeId}`)}
                      className="fa fa-external-link-square-alt" />
                  {this.props.isProjectOwner &&
                    <i  title={t("EditAssignment")}
                        onClick={() => this.props.editEmployee(items[id])}
                        className="fa fa-pen-square " />}
                  {this.props.isProjectOwner &&
                    <i  title={t("DeleteAssignment")} className="fa fa-minus-square "
                        onClick={() => this.props.setDeletingAssignmentId(items[id])} />}
                </span>
                <b>
                  <i>{t("StartDate")}: {items[id].startDate.slice(0, 10)}</i>
                  <i>{t("EndDate")}: {items[id].endDate.slice(0, 10)}</i>
                </b>
              </h5>
              <li>
                {t("AddedBy")}:
                <b>{items[id].createdBy}</b>
                {t("OnDate") + " "}
                {items[id].createdAt.slice(0, 10)}
                <i className="moment-date">
                ({moment().diff(items[id].createdAt.slice(0, 10), "days")}{" "}
                {t("DaysAgo")})
                </i>
              </li>
              {items[id].responsibilities.filter(i => i !== "").length > 0 ?
              <React.Fragment>
              <p>{t("Responsibilities")}: </p>
              <li className="responsibilities-list">
                {items[id].responsibilities.map(i => {
                    if( i != "") {
                        return <i key={i}>{i}</i>;
                    }
                })}
              </li>
              </React.Fragment> : ''}
            </ul>

            <div className="btn-td-container">
                {items[id].employeeId !== this.props.login && (

                  items[id].userFeedback === null ? (
                  <button
                    onClick={() =>
                      this.setState({ opinionModal: true, modalType: true, modalEdit: false })
                    }
                    className="option-btn green-btn"
                  >
                    {t("AddFeedbackShort")}
                  </button>
                  ) : (
                  <button
                    onClick={() =>
                      this.editFeedbackFromProjectDetails(items[id].userFeedback.id, items[id].userFeedback.description)
                    }
                    className="option-btn green-btn"
                  >
                    {t("EditFeedbackShort")}
                  </button>
                  )
                )
              }

              {(canEditFeedbacks || items[id].employeeId === this.props.login) && (
              <button
                className="option-btn green-btn"
                onClick={this.getFeedbacks}
              >
                {t("ShowFeedbacks")}
              </button>
              )}

              {(isDeveloper && items[id].userFeedback) && (
                <button
                className="option-btn option-very-dang"
                onClick={() => {
                  this.setState({deleteFeedbackSpinner: true})
                  this.props.deleteFeedback(items[id].userFeedback.id, projectId, onlyActiveAssignments).
                  then(this.setState({deleteFeedbackSpinner: false}))}}
              >
                {t("DeleteFeedback")}
              </button>
              )}
              { this.state.deleteFeedbackSpinner && (
                <div>
                  <smallSpinner/>
                </div>
              )}


            </div>
          </td>
        </tr>
      );
      for (let i = id + 1; i < this.state.trs.length; i++)
        teamRows.push(this.state.trs[i]);
      this.setState({ currentTrs: teamRows, currentOpenedRowId: id });
    }
  };
  populateTrs = (items, t) => {
    const trs = [];
    for (let i = 0; i < items.length; i++) {
      if(items[i].isDeleted !== true)
      {
        const trItem = (
          <tr onClick={() => this.pushUserDetailsIntoTableDOM(i, t)} key={i}>
            <td>{items[i].firstName + " " + items[i].lastName}</td>
            <td>{items[i].role}</td>
            <td>{items[i].seniority}</td>
            <td>{items[i].title}</td>
            <td>{items[i].startDate.slice(0, 10)}</td>
            <td>{items[i].endDate.slice(0, 10)}</td>
          </tr>
        );
        trs.push(trItem);
      }
    }
    return trs;
  };

  addFeedbackHandler = () => {
    this.setState({ isLoading: true });
    const { addFeedback, projectId, items, onlyActiveAssignments } = this.props;
    const { currentOpenedRowId, addFeedbackItems } = this.state;
    addFeedback(
      projectId,
      items[currentOpenedRowId].employeeId,
      addFeedbackItems[0].value,
      onlyActiveAssignments
    );
    let itemsCopy = JSON.parse(JSON.stringify(this.state.addFeedbackItems));
    itemsCopy[0].value="";
    this.setState({ addFeedbackItems: itemsCopy });
  };
  editFeedbackHandler = () => {
    this.setState({ isLoading: true });
    const { editFeedback,  projectId, onlyActiveAssignments} = this.props;
    const { currentEditedFeedbackId, feedbackItems } = this.state;
    const feedbackModel = {description: feedbackItems[0].value}
    editFeedback(currentEditedFeedbackId, feedbackModel, projectId, onlyActiveAssignments);
  }
  getFeedbacks = () => {
    this.setState({opinionModal: true, modalType: false, modalEdit: false, isLoading: true});
    this.props.getFeedbacks(
      this.props.items[this.state.currentOpenedRowId].employeeId
    );
  };
  deleteFeedback = feedbackId => {
    this.props.deleteFeedback(feedbackId, this.props.projectId, this.props.onlyActiveAssignments)
    .then(() => this.getFeedbacks());
  }
  editFeedback = (feedbackId, feedbackContent) => {
    const feedbackTemp = [...this.state.feedbackItems];
    feedbackTemp[0].value = feedbackContent;
    this.setState({
      feedbackItems: feedbackTemp,
      currentEditedFeedbackId: feedbackId,
      modalEdit: true,
      modalType: true
    });
  }
  editFeedbackFromProjectDetails = (feedbackId, feedbackContent) => {
    this.setState({ opinionModal: true, modalType: true, modalEdit: true });
    this.editFeedback(feedbackId, feedbackContent);
  }
  editFeedbackFromMain = (feedbackId, feedbackContent) => {
    const { modalType } = this.state;
    const { loadedFeedbacks, currentUserEmail } = this.props;
    const myFeedback = loadedFeedbacks.filter(f => f.author === currentUserEmail)[0];
    if(!modalType){
    this.editFeedback(feedbackId, feedbackContent);
     }
    else
      this.changeModal();

  }
  changeModal = () => {
    const { modalType, currentOpenedRowId } = this.state;
    const { getFeedbacks, items } = this.props;

    this.clearData();

    if (modalType) {
      this.setState({ isLoading: true, modalType: false, modalEdit: false });
      getFeedbacks(items[currentOpenedRowId].employeeId);
    } else this.setState({ modalType: true, modalEdit: false });
  };
  clearData = () => {
    const {
      addFeedbackStatus,
      loadFeedbackStatus,
      addFeedbackClear,
      editFeedbackClear,
      getFeedbacksClear,
      editFeedbackStatus
    } = this.props;
    if (addFeedbackStatus !== null && addFeedbackStatus !== undefined)
      addFeedbackClear(null, []);

    if (editFeedbackStatus !== null && editFeedbackStatus !== undefined)
      editFeedbackClear(null, []);

    if (loadFeedbackStatus !== null && loadFeedbackStatus !== undefined)
      getFeedbacksClear([], null, []);
  };
  closeModal = () => {
    this.clearData();
    this.setState({ opinionModal: !this.state.opinionModal });
  };
  componentWillUnmount() {
    this.clearData();
  }

  render() {
    const {
      addFeedbackStatus,
      addFeedbackErrors,
      editFeedbackStatus,
      editFeedbackErrors,
      loadedFeedbacks,
      loadedFeedback,
      loadFeedbackStatus,
      loadFeedbackErrors,
      items,
      thds,
      title,
      togleAddEmployeeModal,
      emptyMsg,
      isProjectOwner,
      t,
      login,
      canEditFeedbacks,
      addFeedbackClear,
      editFeedbackClear,
      currentUserEmail

    } = this.props;
    const { modalType, modalEdit } = this.state;
    return (
      <div className="table-container">
        {items && items.length > 0 ? (
          <Hoc>
            <h3>{title}</h3>
            <table>
              <thead>
                <tr>
                  {thds.map(i => {
                    return <th key={i}>{i}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.currentTrs.map(i => {
                  return i;
                })}
              </tbody>
            </table>
            {isProjectOwner && (
              <button
                onClick={togleAddEmployeeModal}
                className="add-programmer-btn"
              >
                {t("Add")}
              </button>
            )}
          </Hoc>
        ) : (
          <div className="empty-project-squad">
            <div>
              <span>{emptyMsg}</span>
              {isProjectOwner && (
                <i
                  onClick={togleAddEmployeeModal}
                  className="fa fa-user-plus"
                />
              )}
            </div>
          </div>
        )}

        {this.state.currentOpenedRowId !== null && (
          <Modal
            key={1}
            open={this.state.opinionModal}
            classNames={{ modal: "Modal employee-opinion-modal" }}
            contentLabel="Employee opinion modal"
            onClose={this.closeModal}
          >
            <div className="opinion-container">
              <header>
                <h3 className="section-heading">
                  {modalType ? modalEdit ? t("EditFeedback") : t("AddFeedback") : t("FeedbacksList")}
                </h3>
              </header>

              {modalType ? (
                <div className="add-opinion-container">
                  {modalEdit ?
                  <Form
                    transactionEnd={this.props.editFeedbackStatus}
                    btnTitle={t("EditFeedbackShort")}
                    shouldSubmit={true}
                    onSubmit={this.editFeedbackHandler}
                    isLoading={this.state.isLoading}
                    formItems={this.state.feedbackItems}
                  />
                  :
                  <Form
                    transactionEnd={this.props.addFeedbackStatus}
                    btnTitle={t("AddFeedbackShort")}
                    shouldSubmit={true}
                    onSubmit={this.addFeedbackHandler}
                    isLoading={this.state.isLoading}
                    formItems={this.state.addFeedbackItems}
                  />
                  }
                </div>
              ) : this.state.isLoading ? (
                <Spinner />
              ) : loadFeedbackStatus && loadedFeedbacks.length > 0 ? (
                <div className="opinion-list-container">
                  <ul>
                    {loadedFeedbacks.map(j => {
                      return (
                        <li key={j.id}>
                          <p>
                            {t("Author")}: {j.author} => {j.client}
                          {canEditFeedbacks && (
                            <React.Fragment>
                            <i className="fas fa-minus-square"
                            onClick={() => this.deleteFeedback(j.id)}></i>
                            <i className="fas fa-pen-square"
                            onClick={() => this.editFeedback(j.id, j.description)}></i>
                            </React.Fragment>
                          )}
                          </p>
                          <p>{j.description}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="empty-opinions">{t("NoFeedbacks")}</p>

              )}
              {items[this.state.currentOpenedRowId].employeeId !== login && (
                items[this.state.currentOpenedRowId].userFeedback ?
                  (isProjectOwner && (
                    <button
                      onClick={() => this.editFeedbackFromMain(items[this.state.currentOpenedRowId].userFeedback.id,
                        items[this.state.currentOpenedRowId].userFeedback.description)}
                      className="show-opinions-btn"
                    >
                      {modalType ? t("ShowFeedbacks") : t("EditFeedbackShort")}
                    </button>
                  ))
                :
                  (isProjectOwner && (
                    <button
                      onClick={this.changeModal}
                      className="show-opinions-btn"
                    >
                      {modalType ? t("ShowFeedbacks") : t("AddFeedbackShort")}
                    </button>
                  ))

            )}
            </div>
          </Modal>
        )}

        {(addFeedbackStatus !== null && addFeedbackStatus !== undefined )
          && (
            <OperationStatusPrompt
              closePrompt={() => addFeedbackClear(null, [])}
              operationPromptContent={
                addFeedbackStatus
                  ? t("FeedbackAdded")
                  : addFeedbackErrors && addFeedbackErrors[0]
              }
              operationPrompt={addFeedbackStatus}
            />
          )
        }
        {(editFeedbackStatus !== null && editFeedbackStatus !== undefined )
          && (
            <OperationStatusPrompt
              closePrompt={() => editFeedbackClear(null, [])}
              operationPromptContent={
                editFeedbackStatus
                  ? t("FeedbackEdited")
                  : editFeedbackErrors && editFeedbackErrors[0]
              }
              operationPrompt={editFeedbackStatus}
            />
          )
        }


      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    addFeedbackStatus: state.projectsReducer.addFeedbackStatus,
    addFeedbackErrors: state.projectsReducer.addFeedbackErrors,

    loadedFeedbacks: state.projectsReducer.loadedFeedbacks,
    loadFeedbackStatus: state.projectsReducer.loadFeedbackStatus,
    loadFeedbackErrors: state.projectsReducer.loadFeedbackErrors,

    deleteFeedbackStatus: state.projectsReducer.deleteFeedbackStatus,
    deleteFeedbackErrors: state.projectsReducer.deleteFeedbackErrors,

    editFeedbackStatus: state.projectsReducer.editFeedbackStatus,
    editFeedbackErrors: state.projectsReducer.editFeedbackErrors,

    currentUserEmail: state.authReducer.email,
    currentUser: state.authReducer.login
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addFeedback: (projectId, employeeId, description, onlyActiveAssignments) =>
      dispatch(addFeedbackACreator(projectId, employeeId, description, onlyActiveAssignments)),
    getFeedbacks: employeeId => dispatch(getFeedbacksACreator(employeeId)),
    editFeedback: (feedbackId, feedbackContent, projectId, onlyActiveAssignments) =>
      dispatch(editFeedbackACreator(feedbackId, feedbackContent, projectId, onlyActiveAssignments)),
    deleteFeedback: (feedbackId, projectId, onlyActiveAssignments) => dispatch(deleteFeedbackACreator(feedbackId, projectId, onlyActiveAssignments)),
    addFeedbackClear: (status, errors) => dispatch(addFeedback(status, errors)),
    editFeedbackClear: (status, errors) => dispatch(editFeedback(status, errors)),
    getFeedbacksClear: (
      loadedFeedbacks,
      loadFeedbackStatus,
      loadFeedbackErrors
    ) =>
      dispatch(
        getFeedbacks(loadedFeedbacks, loadFeedbackStatus, loadFeedbackErrors)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("ProjectTeamTable")(withRouter(Table)));
