import React from 'react'
import './GDriveContent.scss';
import { connect } from 'react-redux';
import Spinner from '../../common/spinner/spinner';
import { loginACreator, getFoldersACreator } from '../../../actions/gDriveActions';

class GDriveContent extends React.Component{
    state = {
        isLoading: true
    }
    componentDidMount(){
        const isAuth = window.location.href.search("#") === -1 ? false : true;
        if(isAuth && this.props.folders.length === 0){
            this.props.getFolders("root");
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
    
    
    render(){
        const { isLoading } = this.state;
        const { loginStatus, loginErrors, getFoldersStatus, getFoldersErrors } = this.props;
        return (
            <div className="g-drive-container">
                { isLoading ? <Spinner /> :
                
                    loginStatus !== null && 

                    loginStatus ? 
                    <div className="g-drive-content">


                    </div> : 
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
        loginStatus: state.gDriveReducer.loginStatus,
        loginErrors: state.gDriveReducer.loginErrors,
        redirectUrl: state.gDriveReducer.redirectUrl,

        folders: state.gDriveReducer.folders,
        getFoldersStatus: state.gDriveReducer.getFoldersStatus,
        getFoldersErrors: state.gDriveReducer.getFoldersErrors
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(loginACreator()),
        getFolders: (folderId) => dispatch(getFoldersACreator(folderId))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(GDriveContent);
  