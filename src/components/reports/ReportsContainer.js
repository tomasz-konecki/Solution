import React, { Component } from "react";
import { connect } from "react-redux";
import "./ReportsContainer.scss";
import { getTeamsACreator, generateReportACreator, generateReport } from "../../actions/reportsActions";
import { fetchLists, chooseFolder } from '../../actions/persistHelpActions';
import Spinner from "../common/spinner/spinner";
import { validateReportPages } from "services/validation";
import Navigation from "./navigation/navigation";
import GenerateReportModal from './modals/genReport';
import ReportsContent from './reportsContent/reportsContent';
import OneDriveContent from './OneDriveConent/OneDriveContent';
import { withRouter } from 'react-router';
import ChooseDriveView from './chooseDriveView/chooseDriveView';
import GDriveContent from './GDriveContent/GDriveContent';

const driveTypes = ["none", "drive-select", "onedrive", "gdrive"];

class ReportsContainer extends Component {
  state = {
    choosenDriveType: "none",
    spinner: true,
    reportModal: false,
    didPagesHasIncorrectValues: { status: null, error: "" },
    valueToSearch: "",
    isReportGenerating: false,
    extendId: ""
  }

  componentDidMount() {
    const { search } = this.props.history.location;
    if(window.location.href.search("#") !== -1){
      this.setState({choosenDriveType: driveTypes[3], spinner: false});
    }
    else if(search !== "" && this.props.addList.length > 0){
      this.setState({choosenDriveType: driveTypes[2]});
    }
    else
      this.props.getTeams();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.teams !== nextProps.teams && nextProps.teams.length !== 0) {
      this.setState({spinner: false});
      this.props.fetchLists([], [...nextProps.teams], [...nextProps.teams]);
      this.props.chooseFolder(null);
    } 
    else
      this.setState({spinner: false, isReportGenerating: false});
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
    const pagesList = [...this.props.pagesList];
    helpList.push(addList[index]);
    baseList.push(addList[index]);
    addList.splice(index, 1);
    pagesList.splice(index, 1);

    const isListEmpty = addList.length > 0 ? false : true;
    const driveType = isListEmpty ? "none" : this.state.choosenDriveType;

    this.setState({reportModal: !isListEmpty, choosenDriveType: driveType});

    this.props.fetchLists(addList, baseList, helpList, pagesList);
  };

  validateForError = () => {
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    const { pagesList } = this.props;
    let error = "";
    for (let key in pagesList) {
      if (pagesList[key].error)
        error = pagesList[key].error;
    }
    didPagesHasIncorrectValues.error = error;
    didPagesHasIncorrectValues.status = error ? true : null;
    return didPagesHasIncorrectValues;
  };

  openReportsModals = () => {
    const pagesList = [];
    const { addList, baseList, helpList, fetchLists } = this.props;

    for (let i = 0; i < this.props.addList.length; i++)
      pagesList[i] = { value: 1, error: "" };
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };

    didPagesHasIncorrectValues.error = "";
    didPagesHasIncorrectValues.status = null;
    this.setState({
      reportModal: true,
      didPagesHasIncorrectValues: didPagesHasIncorrectValues
    });
    fetchLists(addList, baseList, helpList, pagesList);
  };
  onChangeReportPages = e => {
    const index = Number(e.target.id);
    const pagesList = [...this.props.pagesList];
    const { addList, baseList, helpList, fetchLists } = this.props;
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
        didPagesHasIncorrectValues: didPagesHasIncorrectValues
      });
      fetchLists(addList, baseList, helpList, pagesList);
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

  chooseFolderHandler = folder => {
    if(this.props.addList.length > 0)
      this.openReportsModals();
    
    this.props.chooseFolder(folder);
  }

  putContentIntoVDom = () => {
    const { reportModal, spinner, choosenDriveType, extendId } = this.state;
    const { folders, getFoldersStatus, getFoldersErrors, path, 
      loadTeamsResult, loadTeamsErrors, baseList, choosenFolder } = this.props;
    
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
          extendDetailName={this.extendDetailName}
          extendId={extendId}
          choosenFolder={choosenFolder}
          folders={folders}
          getFoldersStatus={getFoldersStatus}
          getFoldersErrors={getFoldersErrors}
          search={this.props.history.location.search} 
          chooseFolder={this.chooseFolderHandler} />
        );
      case driveTypes[3]:
        return ( <GDriveContent 
           path={path}
           choosenFolder={choosenFolder}
           folders={folders}
           getFoldersStatus={getFoldersStatus}
           getFoldersErrors={getFoldersErrors}
           search={this.props.history.location.search} 
           chooseFolder={this.chooseFolderHandler}
        /> );
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
  generateReportHandler = () => {
    const { addList, choosenFolder, pagesList } = this.props;
    this.setState({isReportGenerating: true});
    this.props.generateReport(addList, choosenFolder, this.state.choosenDriveType, pagesList);
  }

  closeReportModal = () => {
    this.props.generateReportClearData(null, []);
    this.setState({reportModal: false});
  }
  extendDetailName = id => {  
    this.setState({extendId: id});
  }
 
  render() {
    const { reportModal, choosenDriveType, spinner, valueToSearch, isReportGenerating } = this.state;
    const { addList, baseList, folders, pagesList, choosenFolder, generateReportStatus, generateReportErrors } = this.props;
    return (
      <div className="reports-container">

        {spinner || 
          <Navigation
            choosenFolder={choosenFolder}
            choosenDriveType={choosenDriveType}
            addListLength={addList.length}
            baseListLength={baseList.length}
            valueToSearch={valueToSearch}
            numberOfFolders={folders.length}
            searchInTeamList={e => this.searchInTeamList(e)}
            openReportsModals={this.openReportsModals}
            changeIntoFoldersView={() => this.setState({choosenDriveType: driveTypes[1]})}
            changeIntoTeamsView={() => this.setState({choosenDriveType: driveTypes[0]})}
          />  
        }
        
        
        {this.putContentIntoVDom()}

        {
          reportModal && 
          <GenerateReportModal
          generateReport={this.generateReportHandler}
          isReportGenerating={isReportGenerating}
          generateReportStatus={generateReportStatus}
          generateReportErrors={generateReportErrors}

          shouldOpenModal={reportModal}
          closeModal={this.closeReportModal} 
          addList={addList}
          pagesList={pagesList}
          deleteTeamFromResultList={this.deleteTeamFromResultList}
          onChangeReportPages={e => this.onChangeReportPages(e)}
          didPagesHasIncorrectValues={this.state.didPagesHasIncorrectValues.status}
          choosenFolder={choosenFolder}
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
    helpList: state.persistHelpReducer.helpList,
    pagesList: state.persistHelpReducer.pagesList,
    choosenFolder: state.persistHelpReducer.folderToGenerateReport,

    generateReportStatus: state.reportsReducer.generateReportStatus,
    generateReportErrors: state.reportsReducer.generateReportErrors

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeams: () => dispatch(getTeamsACreator()),
    fetchLists: (addList, baseList, helpList, pagesList) => dispatch(fetchLists(addList, baseList, helpList, pagesList)),
    chooseFolder: (folderToGenerateReport) => dispatch(chooseFolder(folderToGenerateReport)),
    generateReport: (teamSheets, choosenFolder, shouldOneDrive, pageList) => dispatch(generateReportACreator(teamSheets, choosenFolder, shouldOneDrive, pageList)),
    generateReportClearData: (status, errors) => dispatch(generateReport(status, errors))
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportsContainer));
