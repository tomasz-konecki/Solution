import React from 'react'
import '../OneDriveContent.scss';
import { connect } from 'react-redux'; 
import { authOneDriveACreator, sendCodeToGetTokenACreator, createFolderACreator,
    deleteFolderACreator, deleteFolder, updateFolderACreator, 
    getFolderACreator, uploadFileACreator,
    generateShareLinkACreator, generateShareLink
} from '../../../actions/oneDriveActions';
import Spinner from '../../common/spinner/spinner';
import Button from '../../common/button/button';
import { validateInput } from '../../../services/validation';
import ConfirmModal from '../../common/confimModal/confirmModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import FilesList from './FilesList/FilesList';
import SmallSpinner from '../../common/spinner/small-spinner';
import FilePicker from '../filePicker/filePicker';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt';
import { invalidTokenError, notRecognizedError, oldTokenComunicate } from '../../../constants';
import { refreshPage } from '../../../services/methods';
import GenerateLinkModal from '../modals/generateLinkModal';
const startPath = "/drive/root:";
const tryToEditAndAddFolderError = "Nie można jednocześnie edytować i dodwać folderów";

class OneDriveContent extends React.PureComponent {
    state = {
        isPreparingForLogingIn: true,
        isTakingCodeFromApi: false,
        currentOpenedFileDetailId: null,

        showAddingFolderInput: false,
        folderNameError: "",
        isAddingFolder: false,
        isDeletingOrEditingFolder: false,

        showDeleteFolderModal: false,
        folderToDeleteId: "",

        editFolderName: "",
        editFolderError: "",
        currentOpenedFolderToEditId: "",

        folderIsLoadingId: "",
        isGoingBack: false,

        fileToUpload: null,
        isUploadingFile: false,

        newFolderName: "",
        newFolderNameError: "",

        folderToGenerateShareLink: null
    }
    

    componentDidMount(){
        const { search, oneDriveToken, authCodeStatus, sendCodeToGetToken,
            authOneDrive, addList, changeIntoTeamsView, getFoldersStatus,
            getFoldersErrors, generateReportStatus } = this.props;
        const didODriveTokenIsCreated = authCodeStatus === null || 
            authCodeStatus === undefined;
    
        if(search === "" && didODriveTokenIsCreated){
            authOneDrive();
        }
            
        else if(search !== "" && didODriveTokenIsCreated){
            this.setState({isPreparingForLogingIn: false, isTakingCodeFromApi: true}, () => {
                sendCodeToGetToken(window.location.href);
            });
        }
        else if(generateReportStatus === null){
            const { getFolder, path } = this.props;
            getFolder(oneDriveToken, path ? path : "/drive/root:");
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.authErrors !== this.props.authErrors){
            if(nextProps.authStatus === true)
                window.location.href = nextProps.authRedirectLink;
            else 
                this.setState({isPreparingForLogingIn: false});
        }

        else if(nextProps.getFoldersErrors !== this.props.getFoldersErrors){
            this.setState({isPreparingForLogingIn: false,
                isTakingCodeFromApi: false, isAddingFolder: false, 
                showAddingFolderInput: false, isDeletingOrEditingFolder: false, 
                showDeleteFolderModal: false, currentOpenedFolderToEditId: "", 
                folderIsLoadingId: "", isGoingBack: false, isUploadingFile: false});
        }
        else if(nextProps.createFolderStatus === false)
            this.setState({ isAddingFolder: false });
        else if(nextProps.deleteFolderStatus === false || nextProps.updateFolderStatus === false)
            this.setState({isDeletingOrEditingFolder: false});
        else if(nextProps.uploadFileStatus === false)
            this.setState({isUploadingFile: false});
    }
    onChangeFolderName = (e, folderName) => {
        const validationResult = this.checkForCorrectInputValue(e.target.value, folderName);
        this.setState({editFolderName: e.target.value, editFolderError: validationResult});
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
            this.setState({isAddingFolder: true, newFolderNameError: validationResult});
            this.props.createFolder(this.state.newFolderName, 
                this.props.path, this.props.oneDriveToken);
        }
        else
            this.setState({newFolderNameError: validationResult});
    }
    deleteFolder = () => {
        this.setState({isDeletingOrEditingFolder: true});
        const { oneDriveToken, path, choosenFolder } = this.props;
        this.props.deleteFolder(this.state.folderToDeleteId, oneDriveToken, path, choosenFolder);
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

    onChangeNewFolderName = e => {
        const validationResult = this.checkForCorrectInputValue(e.target.value);
        this.setState({newFolderName: e.target.value, newFolderNameError: validationResult});
    }

    onEditFolder = (e, folderName) => {
        e.preventDefault();
        const { editFolderName } = this.state;
        const validationResult = this.checkForCorrectInputValue(editFolderName, folderName);
        if(validationResult)
            this.setState({editFolderError: validationResult});
        else{
            const { editFolderName, currentOpenedFolderToEditId } = this.state;
            this.setState({editFolderError: "", isDeletingOrEditingFolder: true});
            this.props.updateFolder(editFolderName, this.state.currentOpenedFolderToEditId, 
                this.props.oneDriveToken, this.props.path);     
        }
    }
    openFolder = folder => {
        this.setState({folderIsLoadingId: folder.id, 
            newFolderName: "", newFolderNameError: "", 
            editFolderError: "", editFolderName: "", currentOpenedFolderToEditId: ""});
        const nextPath = this.props.path + "/" + folder.name;
        this.props.getFolder(this.props.oneDriveToken, nextPath);
    }

    goToFolderBefore = () => {
        this.setState({isGoingBack: true, 
            newFolderName: "", newFolderNameError: "", 
            editFolderError: "", editFolderName: "", currentOpenedFolderToEditId: ""});
        const { path } = {...this.props};
        const lastIndexOfKey = path.lastIndexOf("/");
        const newPath = path.substring(0, lastIndexOfKey);

        this.props.getFolder(this.props.oneDriveToken, newPath);
    }

    handleAddFile = e => { this.setState({fileToUpload: e.target.files}); }

    uploadFile = () => {
        this.setState({isUploadingFile: true});
        this.props.uploadFile(this.props.oneDriveToken, this.props.path,
            this.state.fileToUpload, this.props.folders);
    }
    enableFolderEdit = (currentOpenedFolderToEditId, editFolderName) => {
        this.setState({currentOpenedFolderToEditId:currentOpenedFolderToEditId, 
            editFolderName: editFolderName});
    }
    showDeleteFolderModal = folderId => {
        this.setState({showDeleteFolderModal: true, 
            folderToDeleteId: folderId});
    }
    onFileClick = fileName => {
        this.setState({currentOpenedFileDetailId: 
            fileName === this.state.currentOpenedFileDetailId ? 
            null : fileName})
    }

    chooseFolderToCreateShareLink = (file, e) => {
        e.stopPropagation();        
        
        this.setState({folderToGenerateShareLink: file});
        const { oneDriveToken, generateShareLinkACreator } = this.props;
        generateShareLinkACreator(oneDriveToken, file.id);
    }
    closeShareLinkModal = () => {
        this.setState({folderToGenerateShareLink: null});
        setTimeout(() => {
            this.props.generateShareLinkClear(null, [], "");
        }, 500);
    }
    copyLink = () => {
       window.open(this.props.generatedShareLink);
       this.closeShareLinkModal();
    }
   
    render(){
        const { isPreparingForLogingIn, isTakingCodeFromApi, currentOpenedFileDetailId,
            showAddingFolderInput, isAddingFolder, folderNameError, 
            showDeleteFolderModal, folderToDeleteId, isDeletingOrEditingFolder, 
            currentOpenedFolderToEditId, editFolderName, editFolderError, 
            folderIsLoadingId, isGoingBack, fileToUpload, isUploadingFile,
            newFolderName, newFolderNameError, folderToGenerateShareLink } = this.state;

        const { folders, getFoldersStatus, getFoldersErrors, path, 
            createFolderStatus, createFolderErrors, deleteFolderStatus, 
            deleteFolderErrors, updateFolderStatus, updateFolderErrors, 
            uploadFileStatus, uploadFileErrors, chooseFolder, choosenFolder, 
            extendDetailName, extendId, authCodeStatus, authErrors, authStatus,
            changeSortBy, driveSortType, generateShareLinkStatus, generateShareLinkErrors,
            generatedShareLink } = this.props;
        return (
            <div className="drive-content-container">
                {authCodeStatus && getFoldersStatus && !isPreparingForLogingIn &&
                    <FilePicker sortList={null}
                    fileToUpload={fileToUpload} uploadFile={this.uploadFile}
                    handleAddFile={e => this.handleAddFile(e)} isUploadingFile={isUploadingFile}/>
                }
                
                {(isPreparingForLogingIn || isTakingCodeFromApi || isGoingBack) ? <Spinner /> : 
                    getFoldersStatus !== null && 
                    
                    getFoldersStatus &&

                    <div className="navigation-folders-container">
                        <header>
                            <h3>Aktualna ścieżka: 
                                <span>{path} 
                                   
                                </span>
                            </h3>

                                {newFolderNameError && !editFolderError &&
                                    <p className="validation-error">
                                    {newFolderNameError}</p>
                                }
                                {editFolderError && !newFolderNameError && 
                                    <p className="validation-error">
                                    {editFolderError}</p> 
                                }
                                
                            <Button
                                onClick={!showAddingFolderInput ? () => this.setState({showAddingFolderInput: true})
                                 : null}
                                disable={isAddingFolder || newFolderNameError}
                                title={showAddingFolderInput || "Dodaj folder"}
                                mainClass="generate-raport-btn btn-green"
                                >
                                    {showAddingFolderInput && 
                                        <input 
                                        className={newFolderNameError ? "input-error" : null}
                                        value={newFolderName}

                                        onKeyPress={e => this.onKeyPress(e)}
                                        onChange={e => this.onChangeNewFolderName(e)}
                                        type="text" placeholder="wpisz nazwę folderu..." />
                                    }
                                    <span onClick={this.addFolder}>
                                        <i className="fa fa-folder">
                                        </i>
                                        {showAddingFolderInput && "Stwórz"} 
                                    </span>
                                    

                                    { isAddingFolder && <SmallSpinner /> } 
                                    { showAddingFolderInput && !isAddingFolder && 
                                    <i onClick={newFolderNameError ? null :
                                        () => this.setState({showAddingFolderInput: false})} 
                                        className="fa fa-times"></i> }
                            </Button>    
                            
                            {path !== startPath && 
                            <Button 
                            onClick={(this.goToFolderBefore)}
                            mainClass="generate-raport-btn btn-transparent" title="Cofnij">
                                <i className="fa fa-long-arrow-alt-left"></i>
                            </Button> 
                            }
                           
                        </header>
                        
                        {folders.length === 0 ? 
                            <p className="empty-files-list">
                                Ten folder jest pusty...
                            </p> : 

                            <FilesList 
                            chooseFolderToCreateShareLink={this.chooseFolderToCreateShareLink}
                            driveSortType={driveSortType}
                            sortList={() => changeSortBy(folders, driveSortType, path)}
                            extendDetailName={extendDetailName}
                            extendId={extendId}
                            chooseFolder={chooseFolder}
                            choosenFolder={choosenFolder}
                            folderIsLoadingId={folderIsLoadingId}
                            folders={folders}
                            editFolderName={editFolderName}
                            currentOpenedFileDetailId={currentOpenedFileDetailId}
                            currentOpenedFolderToEditId={currentOpenedFolderToEditId}
                            onEditFolder={this.onEditFolder}
                            editFolderError={editFolderError}
                            onChangeFolderName={this.onChangeFolderName}
                            isDeletingOrEditingFolder={isDeletingOrEditingFolder}
                            openFolder={this.openFolder}

                            enableFolderEdit={this.enableFolderEdit}
                            showDeleteFolderModal={this.showDeleteFolderModal}
                            closeEditingFolderName={() => this.setState({currentOpenedFolderToEditId: "", 
                            editFolderError: ""})}
                            onFileClick={this.onFileClick}
                            />
                        }

                    </div>
                }

                {getFoldersStatus === false && 
                    <p className="one-d-error">
                        {getFoldersErrors[0] === notRecognizedError ? 
                        oldTokenComunicate : getFoldersErrors[0]}
                        <span onClick={refreshPage}>Odśwież</span>
                    </p>
                }
                
                <ConfirmModal 
                open={showDeleteFolderModal} 
                content="Delete project modal"
                onClose={() => this.setState({showDeleteFolderModal: !showDeleteFolderModal, folderToDeleteId: ""})} 
                header="Czy jesteś pewny, że chcesz usunąć ten folder?"
                operation={this.deleteFolder} 
                operationName="Usuń"
                >
                    {isDeletingOrEditingFolder &&
                    <OperationLoader 
                        isLoading={true} 
                        />
                    }
                </ConfirmModal>
                

                {createFolderStatus !== null && 
                    <OperationStatusPrompt
                    key={0} 
                    operationPromptContent={createFolderStatus ? 
                        "Folder utworzony pomyślnie" : createFolderErrors[0]}
                    operationPrompt={createFolderStatus}
                    />
                }

                {deleteFolderStatus !== null && 
                    <OperationStatusPrompt
                    key={1} 
                    operationPromptContent={deleteFolderStatus ? 
                        "Folder został pomyślnie usunięty" : deleteFolderErrors[0]}
                    operationPrompt={deleteFolderStatus}
                    />
                }

                {updateFolderStatus !== null && 
                    <OperationStatusPrompt 
                    key={2} 
                    operationPromptContent={updateFolderStatus ? 
                        "Folder został pomyślnie edytowany" : updateFolderErrors[0]}
                    operationPrompt={updateFolderStatus}
                    />
                }
            
                {uploadFileStatus !== null && 
                    <OperationStatusPrompt 
                    key={3} 
                    operationPromptContent={uploadFileStatus ? 
                        "Pomyślnie dodano plik" : uploadFileErrors[0]}
                    operationPrompt={uploadFileStatus}
                    />
                }
                
                {authStatus === false && 
                    <OperationStatusPrompt 
                    key={5} 
                    operationPromptContent={authErrors[0]}
                    operationPrompt={false}
                    />
                }
                <GenerateLinkModal copyLink={this.copyLink} 
                path={path}
                isOneDrive={true}
                fileToShare={folderToGenerateShareLink}
                generateShareLinkStatus={generateShareLinkStatus}
                generateShareLinkErrors={generateShareLinkErrors} generatedShareLink={generatedShareLink}
                closeModal={this.closeShareLinkModal}
                shouldOpenModal={folderToGenerateShareLink !== null} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authStatus: state.oneDriveReducer.authStatus,
        authErrors: state.oneDriveReducer.authErrors,
        authRedirectLink: state.oneDriveReducer.authRedirectLink,

        oneDriveToken: state.authReducer.oneDriveToken,
        authCodeStatus: state.authReducer.authCodeStatus,
        authCodeErrors: state.authReducer.authCodeErrors,
        refreshToken: state.authReducer.refreshToken,

        createFolderStatus: state.oneDriveReducer.createFolderStatus,
        createFolderErrors: state.oneDriveReducer.createFolderErrors,

        deleteFolderStatus: state.oneDriveReducer.deleteFolderStatus,
        deleteFolderErrors: state.oneDriveReducer.deleteFolderErrors,

        updateFolderStatus: state.oneDriveReducer.updateFolderStatus, 
        updateFolderErrors: state.oneDriveReducer.updateFolderErrors,

        uploadFileStatus: state.oneDriveReducer.uploadFileStatus,
        uploadFileErrors: state.oneDriveReducer.uploadFileErrors,

        generateShareLinkStatus: state.oneDriveReducer.generateShareLinkStatus, 
        generateShareLinkErrors: state.oneDriveReducer.generateShareLinkErrors, 
        generatedShareLink: state.oneDriveReducer.generatedShareLink

    };
  };

  const mapDispatchToProps = dispatch => {
    return {
        authOneDrive: () => dispatch(authOneDriveACreator()),
        sendCodeToGetToken: (url) => dispatch(sendCodeToGetTokenACreator(url)),
        createFolder: (folderName, path, token) => dispatch(createFolderACreator(folderName, path, token)),
        deleteFolder: (folderId, token, path, choosenFolder) => dispatch(deleteFolderACreator(folderId, token, path, choosenFolder)),
        deleteFolderClear: (status, errors) => dispatch(deleteFolder(status, errors)),
        updateFolder: (newName, folderId, token, path) => dispatch(updateFolderACreator(newName, folderId, token, path)),
        getFolder: (token, path) => dispatch(getFolderACreator(token, path)),
        uploadFile: (token, path, file, currentFilesList) => dispatch(uploadFileACreator(token, path, file, currentFilesList)),
        generateShareLinkACreator: (token, fileId) => dispatch(generateShareLinkACreator(token, fileId)),
        generateShareLinkClear: (status, errors, link) => dispatch(generateShareLink(status, errors, link))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(OneDriveContent);
  