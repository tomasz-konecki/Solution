import React from 'react'
import { connect } from 'react-redux';
import Spinner from '../../common/spinner/spinner';
import { getFoldersACreator } from '../../../actions/gDriveActions';
import { loginACreator } from '../../../actions/persistHelpActions';
import FilesList from '../OneDriveConent/FilesList/FilesList';
import '../OneDriveContent.scss';
import Button from '../../common/button/button';
const startPath = "root";

class GDriveContent extends React.Component{
    state = {
        isLoading: true,
        folderIsLoadingName: false
    }
    componentDidMount(){
        const isAuth = window.location.href.search("#") === -1 ? false : true;
        if(isAuth && this.props.folders.length === 0){
            this.props.getFolders(startPath, startPath);
        }
        else{
            this.props.login();
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.loginStatus && window.location.href.search("#") === -1){
            this.setState({isLoading: false});
            window.open(nextProps.redirectUrl);
        }
        else{
            this.setState({isLoading: false});
        }
    }
    openFolder = (folderName, folderId) => {
        this.setState({folderIsLoadingName: folderName});
        this.props.getFolders(folderId, this.props.path + "/" + folderName);
    }
    goToFolderBefore = () => {

    }
    /*
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
                            onStateChange={this.setState}
                            showDeleteFolderModal={this.showDeleteFolderModal}
                            closeEditingFolderName={() => this.setState({currentOpenedFolderToEditId: "", 
                            editFolderError: ""})}
                            onFileClick={this.onFileClick}*/
    render(){
        const { isLoading, folderIsLoadingName } = this.state;
        const { loginStatus, loginErrors, getFoldersStatus, getFoldersErrors, 
            folders, path } = this.props;
        return (
            <div className="drive-content-container">
                { isLoading ? <Spinner /> :
                
                    loginStatus !== null && 

                    loginStatus ? 
                    <div className="navigation-folders-container">
                        <header>
                            <h3>Aktualna ścieżka: {path}</h3>
                        </header>
                        <FilesList 
                        folders={folders} 
                        openFolder={this.openFolder} 
                        folderIsLoadingName={folderIsLoadingName}/>

                        {path !== startPath && 
                            <Button 
                            onClick={(this.goToFolderBefore)}
                            mainClass="generate-raport-btn btn-transparent" title="Cofnij">
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
        path: state.oneDriveReducer.path
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(loginACreator()),
        getFolders: (folderId, path) => dispatch(getFoldersACreator(folderId, path))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(GDriveContent);
  