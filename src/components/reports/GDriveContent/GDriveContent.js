import React from 'react'
import { connect } from 'react-redux';
import Spinner from '../../common/spinner/spinner';
import { getFoldersACreator, deleteFolderACreator, updateFolderACreator,
    createFolderACreator, uploadFileACreator, generateGDriveShareLink, generateGDriveShareLinkACreator } from '../../../actions/gDriveActions';
import { loginACreator, login } from '../../../actions/persistHelpActions';
import { deleteFolder, updateFolder, uploadFile } from '../../../actions/oneDriveActions';
import FilesList from '../OneDriveConent/FilesList/FilesList';
import '../OneDriveContent.scss';
import Button from '../../common/button/button';
import ConfirmModal from '../../common/confimModal/confirmModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import { validateInput } from '../../../services/validation';
import SmallSpinner from '../../common/spinner/small-spinner';
import FilePicker from '../filePicker/filePicker';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt';
import GenerateLinkModal from '../modals/generateLinkModal';
import { translate } from 'react-translate';
const startPath = "root";

class GDriveContent extends React.Component{
    state = {
        isLoading: true,
        folderIsLoadingId: "",
        showDeleteModal: false,
        folderToDeleteId: "",
        currentOpenedFolderToEditId: "",
        showAddingFolderInput: false,
        
        folderNameError: "",
        editFolderName: "",
        isEditingFolder: false,
        
        newFolderName: "",
        newFolderNameError: "",
        isAddingFolder: false,

        fileToUpload: null,
        isUploadingFile: false,

        folderToGenerateShareLink: null
    }
    componentDidMount(){
        const { loginStatus, folders, getFolders, login } = this.props;
        if(window.location.href.search("#") === -1){
            login();
        }
        else if(folders.length === 0 && loginStatus){
            getFolders(startPath, startPath);
        }
    }
    componentWillReceiveProps(nextProps){
        if(window.location.href.search("#") === -1){
            this.setState({isLoading: false, isDeletingOrEditingFolder: false});
            window.location.href = nextProps.redirectUrl;
        }
        else if(nextProps.folders !== this.props.folders || 
            nextProps.editFolderError !== this.props.editFolderError){
            this.setState({isLoading: false, currentOpenedFolderToEditId: "", 
                editFolderName: "", isAddingFolder: false, isEditingFolder: false,
                isUploadingFile: false, showAddingFolderInput: false, folderIsLoadingId: ""});
            if(nextProps.deleteFolderStatus)
                setTimeout(this.closeModal(), 1500);
        }
        else if(nextProps.createFolderErrors !== this.props.createFolderErrors || 
            nextProps.deleteFolderErrors !== this.props.deleteFolderErrors || 
            nextProps.uploadFileErrors !== this.props.uploadFileErrors || 
            nextProps.getFoldersErrors !== this.props.getFoldersErrors){
            this.setState({isAddingFolder: false, isDeletingOrEditingFolder: false, isUploadingFile: false,
                isLoading: false});
        }
    }
    openFolder = folder => {
        this.setState({folderIsLoadingId: folder.id, newFolderName: "", 
            newFolderNameError: "", currentOpenedFolderToEditId: "",
            folderNameError: "", editFolderName: "", showAddingFolderInput: false});
        this.props.getFolders(folder.id, this.props.path + "/" + folder.name);
    }
    goToFolderBefore = () => {
        this.setState({isLoading: true, newFolderName: "", 
        newFolderNameError: "", currentOpenedFolderToEditId: "",
        folderNameError: "", editFolderName: "", showAddingFolderInput: false});
        
        const { path, goBackPath } = this.props;
        const indexOfLastSlash = path.lastIndexOf("/");
        const newPath = path.substring(0, indexOfLastSlash);
        this.props.getFolders(goBackPath, newPath);
    }

    showDeleteFolderModal = folderId => {
        this.setState({showDeleteModal: true, 
            folderToDeleteId: folderId});
    }
    deleteFolder = () => {
        const { path, parentId, choosenFolder } = this.props;
        this.props.deleteFolder(this.state.folderToDeleteId, path, parentId, choosenFolder);
    }
    closeModal = () => {
        this.setState({showDeleteModal: !this.state.showDeleteModal, 
            folderToDeleteId: ""});
        this.props.deleteFolderClear(null, []);
    }
    enableFolderEdit = (folderId, folderName) => {
        this.setState({currentOpenedFolderToEditId: folderId, 
            editFolderName: folderName});
    }

    checkForCorrectInputValue = (value, oldValue) => {
        const validationResult = validateInput(value, false, 
            3,30, "folderName", "nazwa folderu");
        
        if(oldValue){
            const checkForEqualNames = value === oldValue ? "Nie zmieniono wartości" : "";
            if(checkForEqualNames)
                return checkForEqualNames
        }
        
        if(validationResult)
            return validationResult;

        return "";
    }

    onEditFolder = (e, folderName) => {
        e.preventDefault();
        const { editFolderName } = this.state;
        const validationResult = this.checkForCorrectInputValue(editFolderName, folderName);
        if(validationResult)
            this.setState({folderNameError: validationResult});
        else{
            const { editFolderName, currentOpenedFolderToEditId } = this.state;
            const { path, parentId, updateFolder } = this.props;
            this.setState({folderNameError: "", isEditingFolder: true});
            updateFolder(editFolderName, path, parentId, currentOpenedFolderToEditId);
        }
    }
    onChangeFolderName = (e, folderName) => {
        const validationResult = this.checkForCorrectInputValue(e.target.value, folderName);
        this.setState({editFolderName: e.target.value, folderNameError: validationResult});
    }
    openAddingFolderInput = () => {
        this.setState({showAddingFolderInput: true});
    }
    onKeyPress = e => {
        if(e.key === 'Enter'){
            this.addFolder();
        }
    }
    addFolder = () => {
        const { newFolderName } = this.state;
        const validationResult = this.checkForCorrectInputValue(newFolderName);
        if(!validationResult){
            const { parentId, path, createFolder } = this.props;
            this.setState({isAddingFolder: true, newFolderNameError: validationResult});
            createFolder(newFolderName, parentId, 
                path, parentId);
        }
        else
            this.setState({newFolderNameError: validationResult});
    }
    onChangeNewFolderName = e => {
        const validationResult = this.checkForCorrectInputValue(e.target.value);
        this.setState({newFolderName: e.target.value, newFolderNameError: validationResult});
    }

    uploadFile = () => {
        const { path, parentId, uploadFile } = this.props;
        this.setState({isUploadingFile: true});
        uploadFile(path, this.state.fileToUpload, parentId);
    }

    handleAddFile = e => { this.setState({fileToUpload: e.target.files}); }
    
    chooseFolderToCreateShareLink = (file, e) => {
        e.stopPropagation();        
        this.setState({folderToGenerateShareLink: file});
        this.props.generateGDriveShareLinkACreator(file.id);
    }
    closeShareLinkModal = () => {
        this.setState({folderToGenerateShareLink: null});
        setTimeout(() => {
            this.props.generateGDriveShareLinkClear(null, [], "");
        }, 500);
    }
    copyLink = () => {
       window.open(this.props.generatedGDriveSharedLink);
       this.closeShareLinkModal();
    }

    openAddingFolderBtn = () => {
        this.setState({showAddingFolderInput: true});
    }

    closeAddingFolderInput = () => {
        this.setState({showAddingFolderInput: false, newFolderName: "", newFolderNameError: ""});
    }

    render(){
        const { isLoading, folderIsLoadingId, showDeleteModal,
            folderToDeleteId, currentOpenedFolderToEditId, editFolderName, isEditingFolder, 
            showAddingFolderInput, folderNameError, isAddingFolder, newFolderName, 
            newFolderNameError, isUploadingFile, fileToUpload, editFolderError, folderToGenerateShareLink } = this.state;
        const { loginStatus, loginErrors, getFoldersStatus, getFoldersErrors, 
            folders, path, deleteFolderStatus, deleteFolderErrors, loading, 
            updateFolderStatus, updateFolderErrors,
            createFolderStatus, createFolderErrors, uploadFileErrors,
            uploadFileStatus, choosenFolder, extendDetailName, extendId,
            driveSortType, changeSortBy, generateGDriveShareLinkStatus, generateGDriveShareLinkErrors,
            generatedGDriveSharedLink, t } = this.props;

        return (
            <div className="drive-content-container">
                { isLoading ? <Spinner fontSize="7px" 
                    message={t("LoadingAccountDataPrompt")} /> :
                    loginStatus !== null && 

                    loginStatus && getFoldersStatus ? 
                    <div className="navigation-folders-container">
                        <div className="add-folder-container">
                            <Button onClick={!showAddingFolderInput ? this.openAddingFolderBtn : null} disable={isAddingFolder}
                            title={!showAddingFolderInput ? t("AddFolder") : ""}
                            mainClass={`${showAddingFolderInput ? "" : "not-opened-btn"} generate-raport-btn btn-green`}>
                                {showAddingFolderInput && 
                                    <input className={`${newFolderNameError ? "input-error" : null}`}
                                    value={newFolderName}
                                    onKeyPress={e => this.onKeyPress(e)}
                                    onChange={e => this.onChangeNewFolderName(e)}
                                    type="text" placeholder={t("WriteFolderName")} />
                                }
                                <span onClick={this.addFolder}>
                                    <i className="fa fa-folder"/>
                                    {showAddingFolderInput && t("Create")} 
                                </span>
                                { isAddingFolder && <SmallSpinner /> } 
                                { showAddingFolderInput && !isAddingFolder && 
                                <i onClick={this.closeAddingFolderInput} className="fa fa-times"/> }
                            </Button>

                            {newFolderNameError && !folderNameError && 
                                <p className="validation-error">
                                {newFolderNameError}</p>
                            }
                            {folderNameError && !newFolderNameError &&
                                <p className="validation-error">
                                {folderNameError}</p> 
                            }
                        </div>
                        {path !== startPath && getFoldersStatus &&
                            <Button 
                            onClick={(this.goToFolderBefore)}
                            mainClass="generate-raport-btn btn-transparent" title={t("Back")}>
                                <i className="fa fa-long-arrow-alt-left"></i>
                            </Button> 
                        } 
                        <h3>{t("ActualPath")}: <span>{path}</span></h3>
                        
                        {folders.length === 0 && getFoldersStatus ? 
                            <p className="empty-files-list">
                                {t("ThisFolderIsEmpty")}
                            </p> : 

                            <FilesList 
                            chooseFolderToCreateShareLink={this.chooseFolderToCreateShareLink}
                            driveSortType={driveSortType}
                            sortList={() => changeSortBy(folders, driveSortType, path)}
                            choosenFolder={choosenFolder}
                            chooseFolder={this.props.chooseFolder}
                            editFolderError={folderNameError}
                            onChangeFolderName={this.onChangeFolderName}
                            isDeletingOrEditingFolder={isEditingFolder}
                            onEditFolder={this.onEditFolder}
                            closeEditingFolderName={() => this.setState({currentOpenedFolderToEditId: "", 
                                folderNameError: ""})}
                            enableFolderEdit={this.enableFolderEdit}
                            editFolderName={editFolderName}
                            currentOpenedFolderToEditId={currentOpenedFolderToEditId}
                            folders={folders} 
                            openFolder={this.openFolder} 
                            folderIsLoadingId={folderIsLoadingId} 
                            showDeleteFolderModal={this.showDeleteFolderModal} 
                            onFileClick={this.onFileClick}
                            />
                        }
                    </div>
                    : 
                    <p className="one-d-error">{loginErrors[0]}</p>

                }

                {getFoldersStatus === false && 
                    <p className="one-d-error">{getFoldersErrors[0]}</p>
                }

                <ConfirmModal 
                open={showDeleteModal} 
                content="Delete project modal"
                onClose={this.closeModal} 
                header={t("AreYouSureToDelete")}
                operation={this.deleteFolder} 
                operationName={t("Delete")}
                denyName={t("Deny")}
                >
                    <React.Fragment>
                        {(loading || deleteFolderStatus === false) &&
                            <Spinner fontSize="3px" positionClass="abs-spinner" />
                        }
                    </React.Fragment>
           
                </ConfirmModal>
                {updateFolderStatus === false && 
                    <OperationLoader 
                        key={1}
                        close={() => this.props.updateFolderClear(null, [])}
                        isLoading={false} 
                        operationError={updateFolderErrors[0]}
                    />
                }

                {(!isLoading && loginStatus && getFoldersStatus) &&
                    <FilePicker 
                    fileToUpload={fileToUpload} 
                    uploadFile={this.uploadFile}
                    handleAddFile={e => this.handleAddFile(e)} 
                    isUploadingFile={isUploadingFile}/>
                }

                {createFolderStatus !== null && 
                    <OperationStatusPrompt
                    key={0} 
                    operationPromptContent={createFolderStatus ? 
                        t("SuccCreatedFolder") : createFolderErrors[0]}
                    operationPrompt={createFolderStatus}
                    />
                }

                {deleteFolderStatus !== null && 
                    <OperationStatusPrompt
                    key={1} 
                    operationPromptContent={deleteFolderStatus ? 
                        t("SuccDeletedFolder") : deleteFolderErrors[0]}
                    operationPrompt={deleteFolderStatus}
                    />
                }

                {updateFolderStatus !== null && 
                    <OperationStatusPrompt 
                    key={2} 
                    operationPromptContent={updateFolderStatus ? 
                        t("SuccEditedFolder") : updateFolderErrors[0]}
                    operationPrompt={updateFolderStatus}
                    />
                }
            
                {uploadFileStatus !== null && 
                    <OperationStatusPrompt 
                    key={3} 
                    operationPromptContent={uploadFileStatus ? 
                        t("SuccAddedFile") : uploadFileErrors[0]}
                    operationPrompt={uploadFileStatus}
                    />
                }

                <GenerateLinkModal copyLink={this.copyLink} 
                path={path}
                fileToShare={folderToGenerateShareLink}
                generateShareLinkStatus={generateGDriveShareLinkStatus}
                generateShareLinkErrors={generateGDriveShareLinkErrors} generatedShareLink={generatedGDriveSharedLink}
                closeModal={this.closeShareLinkModal}
                shouldOpenModal={folderToGenerateShareLink !== null} />
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        loginStatus: state.persistHelpReducer.loginStatus,
        loginErrors: state.persistHelpReducer.loginErrors,
        redirectUrl: state.persistHelpReducer.redirectUrl,
   
        parentId: state.oneDriveReducer.parentId,
        goBackPath: state.oneDriveReducer.goBackPath,

        deleteFolderStatus: state.oneDriveReducer.deleteFolderStatus,
        deleteFolderErrors: state.oneDriveReducer.deleteFolderErrors,

        updateFolderStatus: state.oneDriveReducer.updateFolderStatus,
        updateFolderErrors: state.oneDriveReducer.updateFolderErrors,

        createFolderStatus: state.oneDriveReducer.createFolderStatus,
        createFolderErrors: state.oneDriveReducer.createFolderErrors,

        uploadFileStatus: state.oneDriveReducer.uploadFileStatus,
        uploadFileErrors: state.oneDriveReducer.uploadFileErrors,

        loading: state.asyncReducer.loading,

        generateGDriveShareLinkStatus: state.gDriveReducer.generateGDriveShareLinkStatus,
        generateGDriveShareLinkErrors: state.gDriveReducer.generateGDriveShareLinkErrors,
        generatedGDriveSharedLink: state.gDriveReducer.generatedGDriveSharedLink
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(loginACreator()),
        loginClearData: (status, errors, redirectUrl) => dispatch(login(status, errors, redirectUrl)),
        getFolders: (folderId, path) => dispatch(getFoldersACreator(folderId, path)),
        deleteFolder: (folderId, path, redirectPath, currentChoosenFolder) => dispatch(deleteFolderACreator(folderId, path, redirectPath, currentChoosenFolder)),
        deleteFolderClear: (status, errors) => dispatch(deleteFolder(status, errors)),
        updateFolder: (name, path, redirectPath, folderId) => dispatch(updateFolderACreator(name, path, redirectPath, folderId)),
        updateFolderClear: (status, errors) => dispatch(updateFolder(status, errors)),
        createFolder: (name, parentId, path, redirectPath) => dispatch(createFolderACreator(name, parentId, path, redirectPath)),
        uploadFile: (path, file, parentId) => dispatch(uploadFileACreator(path, file, parentId)),
        clearUploadFile: (status, errors) => dispatch(uploadFile(status, errors)),
        generateGDriveShareLinkACreator: (folderId) => dispatch(generateGDriveShareLinkACreator(folderId)),
        generateGDriveShareLinkClear: (status, errors, link) => dispatch(generateGDriveShareLink(status, errors, link))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(translate("ReportsCloudView")(GDriveContent));
  