import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal } from '../../actions/progressBarActions';
class PromptsCommander extends React.Component{
 
    render(){
        const { shouldShowGlobal, changeShowGlobal } = this.props;
        return (
            <React.Fragment>
                {shouldShowGlobal ? 
                    <div onClick={() => changeShowGlobal(!shouldShowGlobal)} className="comunicates-window">
                        
                    </div> : 

                    <button title="Komunikaty" 
                    onClick={() => changeShowGlobal(!shouldShowGlobal)} className="comunicates-btn">
                        dasdasasdadsadsadadsadad
                    </button>
                }
                
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        shouldShowGlobal: state.progressBarReducer.shouldShowGlobal
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
        changeShowGlobal: (shouldShowGlobal) => dispatch(changeShowGlobal(shouldShowGlobal))
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(PromptsCommander);
  
