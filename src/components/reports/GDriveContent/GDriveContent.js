import React from 'react'
import { connect } from 'react-redux';
import Spinner from '../../common/spinner/spinner';
import { getFoldersACreator, deleteFolderACreator, updateFolderACreator,
    createFolderACreator } from '../../../actions/gDriveActions';
import { loginACreator } from '../../../actions/persistHelpActions';
import { deleteFolder, updateFolder } from '../../../actions/oneDriveActions';
import FilesList from '../OneDriveConent/FilesList/FilesList';
import '../OneDriveContent.scss';
import Button from '../../common/button/button';
import ConfirmModal from '../../common/confimModal/confirmModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import { validateInput } from '../../../services/validation';
import SmallSpinner from '../../common/spinner/small-spinner';
const startPath = "root";

class GDriveContent extends React.Component{
    state = {
        isLoading: true,
        folderIsLoadingName: false,
        showDeleteModal: false,
        folderToDeleteId: "",
        currentOpenedFolderToEditId: "",
        isEditingFolder: false,
        showAddingFolderInput: false,
        isAddingFolder: false,
        folderNameError: "",
        editFolderName: "",

        newFolderName: "",
        newFolderNameError: ""
        
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
            this.setState({isLoading: false, isDeletingOrEditingFolder: false, isEditingFolder: false});
            window.open(nextProps.redirectUrl);
        }
        else if(nextProps.folders !== this.props.folders){
            this.setState({isLoading: false, isEditingFolder: false, 
                currentOpenedFolderToEditId: "", editFolderName: "", isAddingFolder: false});
            if(nextProps.deleteFolderStatus)
                setTimeout(this.closeModal(), 1500);
        }
        else{
            this.setState({isAddingFolder: false, isDeletingOrEditingFolder: false, isEditingFolder: false})
        }
    }
    openFolder = (folderName, folderId) => {
        this.setState({folderIsLoadingName: folderName});
        this.props.getFolders(folderId, this.props.path + "/" + folderName);
    }
    goToFolderBefore = () => {
        const { path, parentId } = this.props;
        this.setState({isLoading: true});
        this.props.getFolders(parentId, "root");
    }
    cutFromString = (oldStr, fullStr) =>  {
        return fullStr.split(oldStr).join('');
    }
    showDeleteFolderModal = folderId => {
        this.setState({showDeleteModal: true, 
            folderToDeleteId: folderId});
    }
    deleteFolder = () => {
        this.props.deleteFolder(this.state.folderToDeleteId, "root");
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
            this.setState({folderNameError: "", isEditingFolder: true});

            this.props.updateFolder(currentOpenedFolderToEditId, 
                "root", editFolderName);   
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
            const { newFolderName } = this.state;
            const validationResult = this.checkForCorrectInputValue(newFolderName);
            console.log(validationResult);
            if(!validationResult){
                this.setState({isAddingFolder: true, newFolderNameError: validationResult});
                this.props.createFolder(newFolderName, "root", "root");
            }
            else
                this.setState({newFolderNameError: validationResult});
        }
    }
    onChangeNewFolderName = e => {
        const validationResult = this.checkForCorrectInputValue(e.target.value);
        this.setState({newFolderName: e.target.value, newFolderNameError: validationResult});
    }
    render(){
        const { isLoading, folderIsLoadingName, showDeleteModal,
            folderToDeleteId, currentOpenedFolderToEditId, editFolderName, isEditingFolder, 
            showAddingFolderInput, folderNameError, isAddingFolder, newFolderName, 
            newFolderNameError } = this.state;
        const { loginStatus, loginErrors, getFoldersStatus, getFoldersErrors, 
            folders, path, deleteFolderStatus, deleteFolderErrors, loading, 
            updateFolderStatus, updateFolderErrors,
            createFolderStatus, createFolderErrors } = this.props;
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
                                        onBlur={() => this.setState({showAddingFolderInput: false, 
                                            newFolderNameError: ""})}
                                        onKeyPress={e => this.onKeyPress(e)}
                                        onChange={e => this.onChangeNewFolderName(e)}
                                        type="text" placeholder="wpisz nazwę folderu..." />
                                    }
                                    <span onClick={this.openAddingFolderInput} >
                                        <i className="fa fa-folder">
                                        </i>
                                        {showAddingFolderInput && "Stwórz"} 
                                    </span>
                                    

                                    {isAddingFolder && <SmallSpinner /> } 
                            </Button>    
                        </header>
                        <FilesList 
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

                        {path !== startPath && 
                            <Button 
                            onClick={(this.goToFolderBefore)}
                            mainClass="generate-raport-btn btn-transparent btn-g-drive" title="Cofnij">
                                <i className="fa fa-long-arrow-alt-left"></i>
                            </Button> 
                        }
                    </div>
                    : 
                    <p className="g-drive-error-occured">{loginErrors[0]}</p>

                }

                {getFoldersStatus === false && 
                    <p className="g-drive-error-occured">{getFoldersErrors[0]}</p>
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
                        close={() => this.props.updateFolderClear(null, [])}
                        isLoading={false} 
                        operationError={updateFolderErrors[0]}
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

        folders: state.oneDriveReducer.folders,
        getFoldersStatus: state.oneDriveReducer.getFoldersStatus,
        getFoldersErrors: state.oneDriveReducer.getFoldersErrors,
        path: state.oneDriveReducer.path,
        parentId: state.oneDriveReducer.parentId,

        deleteFolderStatus: state.oneDriveReducer.deleteFolderStatus,
        deleteFolderErrors: state.oneDriveReducer.deleteFolderErrors,

        updateFolderStatus: state.oneDriveReducer.updateFolderStatus,
        updateFolderErrors: state.oneDriveReducer.updateFolderErrors,

        createFolderStatus: state.oneDriveReducer.createFolderStatus,
        createFolderErrors: state.oneDriveReducer.createFolderErrors,

        loading: state.asyncReducer.loading
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(loginACreator()),
        getFolders: (folderId, path) => dispatch(getFoldersACreator(folderId, path)),
        deleteFolder: (folderId, path) => dispatch(deleteFolderACreator(folderId, path)),
        deleteFolderClear: (status, errors) => dispatch(deleteFolder(status, errors)),
        updateFolder: (folderId, path, newName) => dispatch(updateFolderACreator(folderId, path, newName)),
        updateFolderClear: (status, errors) => dispatch(updateFolder(status, errors)),
        createFolder: (name, parentId, path) => dispatch(createFolderACreator(name, parentId, path))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(GDriveContent);
  