import React, { Component } from "react";
import { connect } from "react-redux";
import "./ReportsContainer.scss";
import {
  getTeamsACreator,
  generateReportACreator,
  generateReport,
  getRecentAndFavoriteReportsACreator,
  unfavoriteReportACreator
} from "../../actions/reportsActions";
import {
  fetchLists,
  chooseFolder,
  changeSortByACreator
} from "../../actions/persistHelpActions";
import { getFolders } from "../../actions/oneDriveActions";
import Spinner from "../common/spinner/spinner";
import { validateReportPages } from "services/validation";
import Navigation from "./navigation/navigation";
import GenerateReportModal from "./modals/genReport";
import ReportPresets from "./recentReports/reportPresets";
import ReportsContent from "./reportsContent/reportsContent";
import OneDriveContent from "./OneDriveConent/OneDriveContent";
import { withRouter } from "react-router";
import ChooseDriveView from "./chooseDriveView/chooseDriveView";
import GDriveContent from "./GDriveContent/GDriveContent";
import { Route } from "react-router-dom";
import { createSignalRConnection } from "../../actions/progressBarActions";
import { generateSortFunction } from "../../services/methods";
const startPathname = "/main/reports";

class ReportsContainer extends Component {
  state = {
    spinner: this.props.loadTeamsResult && this.props.reportsStatus ? false : true,
    reportModal: false,
    didPagesHasIncorrectValues: { status: null, error: "" },
    valueToSearch: "",
    isReportGenerating: false,
    extendId: "",
    saveAsFavorite: false
  };

  componentDidMount() {
    //this.props.fetchLists([], [],[]);
    //this.props.chooseFolder(null);
    const {
      loadTeamsResult,
      getTeams,
      getRecentAndFavoriteReports,
      fetchLists,
      addList,
      teams,
      baseList,
      helpList
    } = this.props;
    getRecentAndFavoriteReports(5);
    if (addList.length === 0) {
      getTeams();
    } else {
      fetchLists([...addList], [...helpList], [...helpList]);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.teams !== nextProps.teams
      || this.props.reports !== nextProps.reports) {
      this.setState({ spinner: false });
      if (nextProps.loadTeamsResult && this.props.teams.length === 0) {
        const sortFunction = generateSortFunction("numberOfMemberInDB");

        const sortedTeams = [...nextProps.teams].sort(sortFunction);
        this.props.fetchLists([], sortedTeams, sortedTeams);
      }
    } else if (
      nextProps.generateReportStatus &&
      nextProps.getFoldersErrors !== this.props.getFoldersErrors &&
      nextProps.getFoldersStatus &&
      this.state.reportModal
    ) {
      this.props.getRecentAndFavoriteReports(5);
      setTimeout(() => {
        this.setState({ reportModal: false });
        this.props.generateReportClearData(null, []);
        this.props.chooseFolder(null);
      }, 1000);
    } else if (
      nextProps.addList.length === 0 &&
      this.props.history.location.pathname !== startPathname
    )
      this.props.history.push(startPathname);
    else this.setState({ spinner: false, isReportGenerating: false });
  }

  addTeamToResultList = name => {
    const addList = [...this.props.addList];
    const helpList = [...this.props.helpList];
    const baseList = [...this.props.baseList];
    var pagesList = this.props.pagesList ?
      [...this.props.pagesList] : [];
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
    pagesList.push({ value: 1, error: "" }); //przetestować
    this.props.fetchLists(addList, baseList, helpList, pagesList);
  };
  deleteTeamFromResultList = index => {
    const addList = [...this.props.addList];
    const helpList = [...this.props.helpList];
    const pagesList = [...this.props.pagesList];
    const baseList = this.findFromList(
      this.state.valueToSearch,
      helpList.concat(addList[index])
    );
    helpList.push(addList[index]);
    addList.splice(index, 1);
    pagesList.splice(index, 1);

    const isListEmpty = addList.length > 0 ? false : true;

    const sortFunction = generateSortFunction("numberOfMemberInDB");
    const sortedHelpList = helpList.sort(sortFunction);
    const sortedBaseList = baseList.sort(sortFunction);

    this.setState({ reportModal: !isListEmpty });
    this.props.fetchLists(addList, sortedBaseList, sortedHelpList, pagesList);
  };

  validateForError = () => {
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    const { pagesList } = this.props;
    let error = "";
    for (let key in pagesList) {
      if (pagesList[key].error) error = pagesList[key].error;
    }
    didPagesHasIncorrectValues.error = error;
    didPagesHasIncorrectValues.status = error ? true : null;
    return didPagesHasIncorrectValues;
  };

  openReportsModals = () => {
    //const pagesList = [];
    const { addList, baseList, helpList, fetchLists } = this.props;
    var pagesList;
    if (this.props.pagesList && this.props.pagesList.length > 0)
      pagesList = [...this.props.pagesList];
    else pagesList = addList.map(() => ({ value: 1, error: "" }))

    // for (let i = 0; i < this.props.addList.length; i++)
    //   pagesList[i] = { value: 1, error: "" };
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
    const { helpList, addList, fetchLists } = this.props;
    const searchedItems = this.findFromList(e.target.value, helpList);
    this.setState({ valueToSearch: e.target.value });
    fetchLists(addList, searchedItems, helpList);
  };
  findFromList = (value, array) => {
    const searchedItems = [];
    for (let key in array)
      if (array[key].name.toLowerCase().search(value.toLowerCase()) !== -1)
        searchedItems.push(array[key]);
    return searchedItems;
  };
  chooseFolderHandler = folder => {
    if (this.props.addList.length > 0) this.openReportsModals();

    this.props.chooseFolder(folder);
  };
  generateReportHandler = () => {
    const {
      addList,
      choosenFolder,
      pagesList,
      history,
      generateReport,
      createSignalRConnection
    } = this.props;
    this.setState({ isReportGenerating: true });
    createSignalRConnection().then(response => {
      generateReport(addList, choosenFolder, pagesList, history, this.state.saveAsFavorite);
    });
  };

  closeReportModal = () => {
    const { isStarted, chooseFolder, generateReportClearData } = this.props;
    if (!isStarted) chooseFolder(null);

    generateReportClearData(null, []);
    this.setState({ reportModal: false });
  };
  extendDetailName = id => {
    this.setState({ extendId: id });
  };

  clearDrivesData = endPath => {
    const { history, chooseFolder, getFoldersClear } = this.props;
    chooseFolder(null);
    getFoldersClear([], null, [], "");
    history.push(startPathname + endPath);
  };
  chooseRecentReport = teamSheets => {
    let helpList = [...this.props.helpList];
    let baseList = [...this.props.baseList];
    const pagesList = teamSheets.map(teamsheet => ({ value: teamsheet.sheet, error: "" }));
    const addList = teamSheets.map(teamsheet => ({ name: teamsheet.team, numberOfMemberInDB: teamsheet.sheet }));
    const addedLength = addList.length;
    helpList.push(...this.props.addList);
    baseList.push(...this.props.addList);
    for (let i = 0; i < addedLength; i++) {
      const baseIndex = baseList.findIndex(x => x.name === addList[i].name);
      baseList.splice(baseIndex, 1);
      const helpIndex = helpList.findIndex(x => x.name === addList[i].name);
      helpList.splice(helpIndex, 1);
    }

    this.props.fetchLists(addList, baseList, helpList, pagesList);
  }
  toggleAddToFavorites = e => {
    this.setState({ saveAsFavorite: e.target.checked });
  }
  unfavorite = reportId => {
    this.props.unfavoriteReport(reportId);
    this.props.getRecentAndFavoriteReports(5);
  }

  render() {
    const {
      reportModal,
      spinner,
      valueToSearch,
      isReportGenerating,
      extendId
    } = this.state;
    const {
      addList,
      baseList,
      folders,
      pagesList,
      choosenFolder,
      generateReportStatus,
      generateReportErrors,
      getFoldersStatus,
      getFoldersErrors,
      path,
      loadTeamsResult,
      loadTeamsErrors,
      history,
      isStarted,
      driveSortType,
      changeSortBy,
      reportsStatus,
      reports,
      reportsErrors
    } = this.props;
    const { push } = history;
    const { pathname } = history.location;
    return (
      <div className="content-container reports-container">
        {spinner || (
          <Navigation
            pathname={pathname}
            baseList={baseList}
            choosenFolder={choosenFolder}
            addListLength={addList.length}
            baseListLength={baseList.length}
            valueToSearch={valueToSearch}
            numberOfFolders={folders.length}
            searchInTeamList={e => this.searchInTeamList(e)}
            openReportsModals={this.openReportsModals}
            changeIntoFoldersView={() => push(startPathname + "/choose")}
            changeIntoTeamsView={() => push(startPathname)}
          />
        )}

        <Route
          path={startPathname + "/gdrive"}
          render={() => {
            return (
              <GDriveContent
                driveSortType={driveSortType}
                changeSortBy={changeSortBy}
                path={path}
                choosenFolder={choosenFolder}
                folders={folders}
                getFoldersStatus={getFoldersStatus}
                getFoldersErrors={getFoldersErrors}
                search={this.props.history.location.search}
                chooseFolder={this.chooseFolderHandler}
              />
            );
          }}
        />

        <Route
          path={startPathname + "/onedrive"}
          render={() => {
            return (
              <OneDriveContent
                driveSortType={driveSortType}
                changeSortBy={changeSortBy}
                generateReportStatus={generateReportStatus}
                path={path}
                extendDetailName={this.extendDetailName}
                extendId={extendId}
                choosenFolder={choosenFolder}
                folders={folders}
                getFoldersStatus={getFoldersStatus}
                getFoldersErrors={getFoldersErrors}
                search={this.props.history.location.search}
                chooseFolder={this.chooseFolderHandler}
              />
            );
          }}
        />

        <Route
          path={startPathname + "/choose"}
          render={() => {
            return (
              <ChooseDriveView
                goToNonePage={() => push(startPathname)}
                selectOneDrive={() => this.clearDrivesData("/onedrive")}
                selectGDrive={() => this.clearDrivesData("/gdrive")}
              />
            );
          }}
        />

        <Route
          exact
          path={startPathname}
          render={() => {
            return (
              <React.Fragment>
                <ReportPresets chooseRecentReport={this.chooseRecentReport} reports={reports.favoriteReports}
                  reportsStatus={reportsStatus} reportsErrors={reportsErrors} onDelete={this.unfavorite}>
                  <h1>Ulubione raporty</h1>
                </ReportPresets>
                <ReportPresets chooseRecentReport={this.chooseRecentReport} reports={reports.recentReports}
                  reportsStatus={reportsStatus} reportsErrors={reportsErrors}>
                  <h1>Ostatnie raporty</h1>
                </ReportPresets>
                <ReportsContent
                  spinner={spinner}
                  loadTeamsResult={loadTeamsResult}
                  baseList={baseList}
                  addTeamToResultList={this.addTeamToResultList}
                  loadTeamsErrors={loadTeamsErrors}
                />
              </React.Fragment>
            );
          }}
        />

        {reportModal && (
          <GenerateReportModal
            currentPath={pathname}
            generateReport={this.generateReportHandler}
            isReportGenerating={isReportGenerating}
            generateReportStatus={generateReportStatus}
            generateReportErrors={generateReportErrors}
            startPathname={startPathname}
            shouldOpenModal={reportModal}
            closeModal={this.closeReportModal}
            addList={addList}
            pagesList={pagesList}
            deleteTeamFromResultList={this.deleteTeamFromResultList}
            onChangeReportPages={e => this.onChangeReportPages(e)}
            didPagesHasIncorrectValues={
              this.state.didPagesHasIncorrectValues.status
            }
            choosenFolder={choosenFolder}
            isStarted={isStarted}
            addToFavorites={this.toggleAddToFavorites}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: state.reportsReducer.teams,
    loadTeamsResult: state.reportsReducer.loadTeamsResult,
    loadTeamsErrors: state.reportsReducer.loadTeamsErrors,

    reports: state.reportsReducer.reports,
    reportsStatus: state.reportsReducer.reportsStatus,
    reportsErrors: state.reportsReducer.reportsErrors,

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
    generateReportErrors: state.reportsReducer.generateReportErrors,

    isStarted: state.progressBarReducer.isStarted,

    driveSortType: state.persistHelpReducer.driveSortType,

    unfavoriteStatus: state.reportsReducer.unfavoriteStatus,
    unfavoriteErrors: state.reportsReducer.unfavoriteErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeams: () => dispatch(getTeamsACreator()),
    getRecentAndFavoriteReports: numberOfReports =>
      dispatch(getRecentAndFavoriteReportsACreator(numberOfReports)),
    getFoldersClear: (folders, status, errors, path) =>
      dispatch(getFolders(folders, status, errors, path)),
    fetchLists: (addList, baseList, helpList, pagesList) =>
      dispatch(fetchLists(addList, baseList, helpList, pagesList)),
    chooseFolder: folderToGenerateReport =>
      dispatch(chooseFolder(folderToGenerateReport)),
    generateReport: (teamSheets, choosenFolder, pageList, history, saveAsFavorite) =>
      dispatch(
        generateReportACreator(teamSheets, choosenFolder, pageList, history, saveAsFavorite)
      ),
    generateReportClearData: (status, errors) =>
      dispatch(generateReport(status, errors)),
    createSignalRConnection: () => dispatch(createSignalRConnection()),
    changeSortBy: (listToSort, sortType, path) =>
      dispatch(changeSortByACreator(listToSort, sortType, path)),
    unfavoriteReport: reportId => 
      dispatch(unfavoriteReportACreator(reportId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportsContainer));
