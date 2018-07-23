import React from 'react'
import '../OneDriveContent.scss';
import { connect } from 'react-redux'; 
import { authOneDriveACreator, sendCodeToGetTokenACreator, createFolderACreator,
    deleteFolderACreator, deleteFolder, updateFolderACreator, 
    updateFolder, getFolderACreator, uploadFileACreator, uploadFile  
} from '../../../actions/oneDriveActions';
import Spinner from '../../common/spinner/spinner';
import Button from '../../common/button/button';
import { validateInput } from '../../../services/validation';
import ConfirmModal from '../../common/confimModal/confirmModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import FilesList from './FilesList/FilesList';
import SmallSpinner from '../../common/spinner/small-spinner';
import FilePicker from '../filePicker/filePicker';

const startPath = "/drive/root:";

class OneDriveContent extends React.PureComponent {
    state = {
        isPreparingForLogingIn: true,
        isTakingCodeFromApi: false,
        currentOpenedFolderDetailName: null,

        showAddingFolderInput: false,
        folderNameError: "",
        isAddingFolder: false,
        isDeletingOrEditingFolder: false,

        showDeleteFolderModal: false,
        folderToDeleteId: "",

        editFolderName: "",
        editFolderError: "",
        currentOpenedFolderToEditId: "",

        folderIsLoadingName: "",
        isGoingBack: false,

        fileToUpload: null,
        isUploadingFile: false,

        newFolderName: "",
        newFolderNameError: ""
    }
    componentDidMount(){
        const { search } = this.props;
        if(search === ""){
            this.props.authOneDrive();
        }
        else{
            this.setState({isPreparingForLogingIn: false});
            if(!this.props.authCodeToken){
                this.setState({isTakingCodeFromApi: true});
                this.props.sendCodeToGetToken(window.location.href);
            }
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.authErrors !== this.props.authErrors){
            window.open(nextProps.authRedirectLink);
            this.setState({isPreparingForLogingIn: false});
        }
        else if(nextProps.getFoldersErrors !== this.props.getFoldersErrors){
            this.setState({isTakingCodeFromApi: false, isAddingFolder: false, 
                showAddingFolderInput: false, isDeletingOrEditingFolder: false, 
                showDeleteFolderModal: false, currentOpenedFolderToEditId: "", 
                folderIsLoadingName: "", isGoingBack: false, isUploadingFile: false});
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

    openAddingFolderInput = () => {
        const { showAddingFolderInput, newFolderName } = this.state;
        const validationResult = this.checkForCorrectInputValue(newFolderName);
        
        if(showAddingFolderInput && !validationResult){
            this.setState({isAddingFolder: true});
            this.props.createFolder(this.state.newFolderName, this.props.path, 
                this.props.authCodeToken);
        }
        else
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
            this.setState({isAddingFolder: true, newFolderNameError: validationResult});
            this.props.createFolder(this.state.newFolderName, 
                this.props.path, this.props.authCodeToken);
        }
        else
            this.setState({newFolderNameError: validationResult});
    }
    deleteFolder = () => {
        this.setState({isDeletingOrEditingFolder: true});
        const { authCodeToken, path, choosenFolder } = this.props;
        this.props.deleteFolder(this.state.folderToDeleteId, authCodeToken, path, choosenFolder);
    }

    checkForCorrectInputValue = (value, oldValue) => {
        const validationResult = validateInput(value, false, 
            3,30, "name", "nazwa folderu");
        
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
                this.props.authCodeToken, this.props.path);     
        }
    }
    openFolder = folderName => {
        this.setState({folderIsLoadingName: folderName});
        const nextPath = this.props.path + "/" + folderName;
        this.props.getFolder(this.props.authCodeToken, nextPath);
    }

    goToFolderBefore = () => {
        this.setState({isGoingBack: true});
        const { path } = {...this.props};
        const lastIndexOfKey = path.lastIndexOf("/");
        const newPath = path.substring(0, lastIndexOfKey);

        this.props.getFolder(this.props.authCodeToken, newPath);
    }

    handleAddFile = e => { this.setState({fileToUpload: e.target.files}); }

    uploadFile = () => {
        this.setState({isUploadingFile: true});
        this.props.uploadFile(this.props.authCodeToken, this.props.path,
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
        this.setState({currentOpenedFolderDetailName: 
            fileName === this.state.currentOpenedFolderDetailName ? 
            null : fileName})
    }
    render(){
        const { isPreparingForLogingIn, isTakingCodeFromApi, currentOpenedFolderDetailName,
            showAddingFolderInput, isAddingFolder, folderNameError, 
            showDeleteFolderModal, folderToDeleteId, isDeletingOrEditingFolder, 
            currentOpenedFolderToEditId, editFolderName, editFolderError, 
            folderIsLoadingName, isGoingBack, fileToUpload, isUploadingFile,
            newFolderName, newFolderNameError } = this.state;

        const { folders, getFoldersStatus, getFoldersErrors, path, 
            createFolderStatus, createFolderErrors, deleteFolderStatus, 
            deleteFolderErrors, updateFolderStatus, updateFolderErrors, 
            uploadFileStatus, uploadFileErrors, chooseFolder, choosenFolder } = this.props;
        return (
            <div className="drive-content-container">

                {(isPreparingForLogingIn || isTakingCodeFromApi || isGoingBack) || 
                    <FilePicker fileToUpload={fileToUpload} uploadFile={this.uploadFile}
                    handleAddFile={e => this.handleAddFile(e)} isUploadingFile={isUploadingFile}/>
                }
                

                {(isPreparingForLogingIn || isTakingCodeFromApi || isGoingBack) ? <Spinner /> : 
                    getFoldersStatus !== null && 
                    
                    getFoldersStatus &&

                    <div className="navigation-folders-container">
                        <header>
                            <h3>Aktualna ścieżka: <span>{path}</span></h3>
                            {createFolderStatus === false && 
                                <p className="server-error">
                                {createFolderErrors[0]}</p>
                            }
                            
                            <Button
                                onClick={!showAddingFolderInput ? () => this.setState({showAddingFolderInput: true}) : null}
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
                                    <span onClick={this.openAddingFolderInput} >
                                        <i onClick={this.addFolder} className="fa fa-folder">
                                        </i>
                                        {showAddingFolderInput && "Stwórz"} 
                                    </span>
                                    

                                    {isAddingFolder && <SmallSpinner /> } 
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
                            chooseFolder={chooseFolder}
                            choosenFolder={choosenFolder}
                            folderIsLoadingName={folderIsLoadingName}
                            folders={folders}
                            editFolderName={editFolderName}
                            currentOpenedFolderDetailName={currentOpenedFolderDetailName}
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
                    <p className="one-d-error">{getFoldersErrors[0]}</p>
                }
                
                <ConfirmModal 
                open={showDeleteFolderModal} 
                content="Delete project modal"
                onClose={() => this.setState({showDeleteFolderModal: !showDeleteFolderModal, folderToDeleteId: ""})} 
                header="Czy jesteś pewny, że chcesz usunąć ten folder?"
                operation={this.deleteFolder} 
                operationName="Usuń"
                >
                    {(isDeletingOrEditingFolder || deleteFolderStatus === false) &&
                    <OperationLoader 
                    close={() => this.props.deleteFolderClear(null, [])}
                    isLoading={isDeletingOrEditingFolder} 
                    operationError={deleteFolderErrors[0]}
                    />
                    }
                </ConfirmModal>

                
                {updateFolderStatus === false &&
                    <OperationLoader 
                    close={() => this.props.updateFolderClear(null, [])}
                    isLoading={false} 
                    operationError={updateFolderErrors[0]}
                    />
                }
                
                {uploadFileStatus === false &&
                    <OperationLoader 
                    close={() => this.props.uploadFileClear(null, [])}
                    isLoading={false} 
                    operationError={uploadFileErrors[0]}
                    />
                }
           
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authStatus: state.oneDriveReducer.authStatus,
        authErrors: state.oneDriveReducer.authErrors,
        authRedirectLink: state.oneDriveReducer.authRedirectLink,

        authCodeToken: state.oneDriveReducer.authCodeToken,
        authCodeStatus: state.oneDriveReducer.authCodeStatus,
        authCodeErrors: state.oneDriveReducer.authCodeErrors,

        createFolderStatus: state.oneDriveReducer.createFolderStatus,
        createFolderErrors: state.oneDriveReducer.createFolderErrors,

        deleteFolderStatus: state.oneDriveReducer.deleteFolderStatus,
        deleteFolderErrors: state.oneDriveReducer.deleteFolderErrors,

        updateFolderStatus: state.oneDriveReducer.updateFolderStatus, 
        updateFolderErrors: state.oneDriveReducer.updateFolderErrors,

        uploadFileStatus: state.oneDriveReducer.uploadFileStatus,
        uploadFileErrors: state.oneDriveReducer.uploadFileErrors
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
        updateFolderClear: (status, errors) => dispatch(updateFolder(status, errors)),
        getFolder: (token, path) => dispatch(getFolderACreator(token, path)),
        uploadFile: (token, path, file, currentFilesList) => dispatch(uploadFileACreator(token, path, file, currentFilesList)),
        uploadFileClear: (uploadFileStatus, uploadFileErrors) => dispatch(uploadFile(uploadFileStatus, uploadFileErrors))    
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(OneDriveContent);
  