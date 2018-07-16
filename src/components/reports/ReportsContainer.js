import React, { Component } from "react";
import { connect } from "react-redux";
import "./ReportsContainer.scss";
import { getTeamsACreator } from "../../actions/reportsActions";
import { fetchLists, chooseFolder } from '../../actions/persistHelpActions';
import Spinner from "../common/spinner/spinner";
import { validateReportPages } from "services/validation";
import Navigation from "./navigation/navigation";
import GenerateReportModal from './modals/genReport';
import ReportsContent from './reportsContent/reportsContent';
import OneDriveContent from './OneDriveConent/OneDriveContent';
import { withRouter } from 'react-router';
import ChooseDriveView from './chooseDriveView/chooseDriveView';

const driveTypes = ["none", "drive-select", "onedrive", "gdrive"];

class ReportsContainer extends Component {
  state = {
    choosenDriveType: "none",
    spinner: true,
    reportModal: false,
    pagesList: [],
    didPagesHasIncorrectValues: { status: null, error: "" },
    valueToSearch: ""
  }
  componentDidMount() {
    const { search } = this.props.history.location;
    if(search !== ""){
      this.setState({choosenDriveType: driveTypes[2]});
    }
    else
      this.props.getTeams();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.teams !== nextProps.teams && nextProps.teams.length !== 0) {
      this.setState({spinner: false});
      this.props.fetchLists([], [...nextProps.teams], [...nextProps.teams]);
    } 
    else
      this.setState({spinner: false});
  }

  addTeamToResultList = name => {
    const addList = [...this.props.addList];
    const helpList = [...this.props.helpList];
    const baseList = [...this.props.baseList];
    const index = this.props.baseList.findIndex(i => {
      return i.name === name;
    });
    const helpListIndex = this.props.helpList.findIndex(i => {
      return i.name === name;
    });
    const helpBaseListIndex = this.props.baseList.findIndex(i => {
      return i.name === name;
    });
    helpList.splice(helpListIndex, 1);
    addList.push(this.props.baseList[index]);
    baseList.splice(helpBaseListIndex, 1);
    this.props.fetchLists(addList, baseList, helpList);
  };
  deleteTeamFromResultList = index => {
    const addList = [...this.props.addList];
    const baseList = [...this.props.baseList];
    const helpList = [...this.props.helpList];
    const pagesList = [...this.state.pagesList];
    helpList.push(addList[index]);
    baseList.push(addList[index]);
    addList.splice(index, 1);
    pagesList.splice(index, 1);

    this.setState({pagesList: pagesList, reportModal: addList.length > 0 ? true : false});
    this.props.fetchLists(addList, baseList, helpList);
  };

  validateForError = () => {
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    let error = "";
    for (let key in this.state.pagesList) {
      if (this.state.pagesList[key].error)
        error = this.state.pagesList[key].error;
    }
    didPagesHasIncorrectValues.error = error;
    didPagesHasIncorrectValues.status = error ? true : null;
    return didPagesHasIncorrectValues;
  };

  openReportsModals = () => {
    const pagesList = [];
    for (let i = 0; i < this.props.addList.length; i++)
      pagesList[i] = { value: 1, error: "" };
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    didPagesHasIncorrectValues.error = "";
    didPagesHasIncorrectValues.status = null;
    this.setState({
      pagesList: pagesList,
      reportModal: true,
      didPagesHasIncorrectValues: didPagesHasIncorrectValues
    });
  };
  onChangeReportPages = e => {
    const index = Number(e.target.id);
    const pagesList = [...this.state.pagesList];
    if (e.target.value.length >= 1) {
      const convertedValue = Number(e.target.value);
      const validation = validateReportPages(convertedValue);
      const didPagesHasIncorrectValues = {
        ...this.state.didPagesHasIncorrectValues
      };
      if (validation !== "") {
        pagesList[index] = { value: e.target.value, error: validation };
        didPagesHasIncorrectValues.status = false;
      } else {
        pagesList[index] = { value: convertedValue, error: "" };
        didPagesHasIncorrectValues.status = true;
      }
      this.setState({
        pagesList: pagesList,
        didPagesHasIncorrectValues: didPagesHasIncorrectValues
      });
    }
  };
  searchInTeamList = e => {
    const searchedItems = [];
    for (let key in this.props.helpList)
      if (this.props.helpList[key].name.toLowerCase().search(e.target.value.toLowerCase()) !== -1)
        searchedItems.push(this.props.helpList[key]);
    this.setState({valueToSearch: e.target.value});
    this.props.fetchLists(this.props.addList, searchedItems, this.props.helpList);
  }

  putContentIntoVDom = () => {
    const { reportModal, spinner, choosenDriveType } = this.state;
    const { folders, getFoldersStatus, getFoldersErrors, path, loadTeamsResult, loadTeamsErrors, baseList } = this.props;
    
    switch(choosenDriveType){
      case driveTypes[1]:
        return (
          <ChooseDriveView 
          goToNonePage={() => this.setState({choosenDriveType: driveTypes[0]})}
          selectOneDrive={() => this.setState({choosenDriveType: driveTypes[2]})}
          selectGDrive={() => this.setState({choosenDriveType: driveTypes[3]})} />
        );
      case driveTypes[2]:
        return (
          <OneDriveContent 
          path={path}
          folders={folders}
          getFoldersStatus={getFoldersStatus}
          getFoldersErrors={getFoldersErrors}
          search={this.props.history.location.search} />
        );
      case driveTypes[3]:
      break;

      default:
        return (
          <ReportsContent 
          spinner={spinner}
          loadTeamsResult={loadTeamsResult} 
          baseList={baseList} 
          addTeamToResultList={this.addTeamToResultList} 
          loadTeamsErrors={loadTeamsErrors} />
        );
    }
  }
  componentWillUnmount(){ this.props.fetchLists([],[],[]); }

  render() {
    const {  reportModal, choosenDriveType, pagesList } = this.state;
    const { addList, baseList, folders } = this.props;

    return (
      <div className="reports-container">
        <Navigation
            choosenDriveType={choosenDriveType}
            addListLength={addList.length}
            baseListLength={baseList.length}
            numberOfFolders={folders.length}
            searchInTeamList={e => this.searchInTeamList(e)}
            openReportsModals={this.openReportsModals}
            changeIntoFoldersView={() => this.setState({choosenDriveType: driveTypes[1]})}
            changeIntoTeamsView={() => this.setState({choosenDriveType: driveTypes[0]})}
        />  
        {this.putContentIntoVDom()}

        {
          reportModal && 
          <GenerateReportModal
          shouldOpenModal={reportModal}
          closeModal={() => this.setState({ reportModal: false })} 
          addList={addList}
          pagesList={pagesList}
          deleteTeamFromResultList={this.deleteTeamFromResultList}
          onChangeReportPages={e => this.onChangeReportPages(e)}
          didPagesHasIncorrectValues={this.state.didPagesHasIncorrectValues.status}
          />
        }

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: state.reportsReducer.teams,
    loadTeamsResult: state.reportsReducer.loadTeamsResult,
    loadTeamsErrors: state.reportsReducer.loadTeamsErrors,

    folders: state.oneDriveReducer.folders,
    getFoldersStatus: state.oneDriveReducer.getFoldersStatus,
    getFoldersErrors: state.oneDriveReducer.getFoldersErrors,
    path: state.oneDriveReducer.path,

    addList: state.persistHelpReducer.addList,
    baseList: state.persistHelpReducer.baseList,
    helpList: state.persistHelpReducer.helpList

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeams: () => dispatch(getTeamsACreator()),
    fetchLists: (addList, baseList, helpList) => dispatch(fetchLists(addList, baseList, helpList)),
    chooseFolder: (folderToGenerateReport) => dispatch(chooseFolder(folderToGenerateReport))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportsContainer));
