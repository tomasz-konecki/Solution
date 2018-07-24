import React from 'react'
import { connect } from 'react-redux';
import Spinner from '../../common/spinner/spinner';
import { getFoldersACreator, deleteFolderACreator, updateFolderACreator,
    createFolderACreator, uploadFileACreator } from '../../../actions/gDriveActions';
import { loginACreator } from '../../../actions/persistHelpActions';
import { deleteFolder, updateFolder, uploadFile } from '../../../actions/oneDriveActions';
import FilesList from '../OneDriveConent/FilesList/FilesList';
import '../OneDriveContent.scss';
import Button from '../../common/button/button';
import ConfirmModal from '../../common/confimModal/confirmModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import { validateInput } from '../../../services/validation';
import SmallSpinner from '../../common/spinner/small-spinner';
import FilePicker from '../filePicker/filePicker';
const startPath = "root";

class GDriveContent extends React.Component{
    state = {
        isLoading: true,
        folderIsLoadingName: "",
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
        isUploadingFile: false        
        
        
    }
    componentDidMount(){
        const isAuth = window.location.href.search("#") === -1 ? false : true;
        if(isAuth && this.props.folders.length === 0){
            this.props.getFolders(startPath, startPath);
        }
        else
            this.props.login();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.loginStatus && window.location.href.search("#") === -1){
            this.setState({isLoading: false, isDeletingOrEditingFolder: false});
            window.open(nextProps.redirectUrl);
        }
        else if(nextProps.folders !== this.props.folders || 
            nextProps.editFolderError !== this.props.editFolderError){
            this.setState({isLoading: false, currentOpenedFolderToEditId: "", 
                editFolderName: "", isAddingFolder: false, isEditingFolder: false,
                isUploadingFile: false, showAddingFolderInput: false, folderIsLoadingName: ""});
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
    openFolder = (folderName, folderId) => {
        this.setState({folderIsLoadingName: folderName});
        this.props.getFolders(folderId, this.props.path + "/" + folderName);
    }
    goToFolderBefore = () => {
        this.setState({isLoading: true});
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
    
    render(){
        const { isLoading, folderIsLoadingName, showDeleteModal,
            folderToDeleteId, currentOpenedFolderToEditId, editFolderName, isEditingFolder, 
            showAddingFolderInput, folderNameError, isAddingFolder, newFolderName, 
            newFolderNameError, isUploadingFile, fileToUpload } = this.state;
        const { loginStatus, loginErrors, getFoldersStatus, getFoldersErrors, 
            folders, path, deleteFolderStatus, deleteFolderErrors, loading, 
            updateFolderStatus, updateFolderErrors,
            createFolderStatus, createFolderErrors, uploadFileErrors,
            uploadFileStatus, choosenFolder } = this.props;
        return (
            <div 
                className="drive-content-container">
                { isLoading ? <Spinner /> :
                    loginStatus !== null && 

                    loginStatus ? 
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
                        </header>
                        {folders.length === 0 && getFoldersStatus ? 
                            <p className="empty-files-list">
                                Ten folder jest pusty...
                            </p> : 

                            <FilesList 
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
                            folderIsLoadingName={folderIsLoadingName} 
                            showDeleteFolderModal={this.showDeleteFolderModal} 
                            />
                        }

                        

                        {path !== startPath && 
                            <Button 
                            onClick={(this.goToFolderBefore)}
                            mainClass="generate-raport-btn btn-transparent btn-g-drive" title="Cofnij">
                                <i className="fa fa-long-arrow-alt-left"></i>
                            </Button> 
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
                header="Czy jesteś pewny, że chcesz usunąć ten folder?"
                operation={this.deleteFolder} 
                operationName="Usuń"
                >
                    <React.Fragment>
                        {(loading || deleteFolderStatus === false) &&
                        <OperationLoader 
                        close={() => this.props.deleteFolderClear(null, [])}
                        isLoading={loading} 
                        operationError={deleteFolderErrors[0]}
                        />
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

                {uploadFileStatus === false && 
                    <OperationLoader 
                        key={2}
                        close={() => this.props.clearUploadFile(null, [])}
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

        loading: state.asyncReducer.loading
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(loginACreator()),
        getFolders: (folderId, path) => dispatch(getFoldersACreator(folderId, path)),
        deleteFolder: (folderId, path, redirectPath, currentChoosenFolder) => dispatch(deleteFolderACreator(folderId, path, redirectPath, currentChoosenFolder)),
        deleteFolderClear: (status, errors) => dispatch(deleteFolder(status, errors)),
        updateFolder: (name, path, redirectPath, folderId) => dispatch(updateFolderACreator(name, path, redirectPath, folderId)),
        updateFolderClear: (status, errors) => dispatch(updateFolder(status, errors)),
        createFolder: (name, parentId, path, redirectPath) => dispatch(createFolderACreator(name, parentId, path, redirectPath)),
        uploadFile: (path, file, parentId) => dispatch(uploadFileACreator(path, file, parentId)),
        clearUploadFile: (status, errors) => dispatch(uploadFile(status, errors))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(GDriveContent);
  