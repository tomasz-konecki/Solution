import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
import { changeShowGlobal } from '../../actions/progressBarActions';
class PromptsCommander extends React.Component{
    render(){
        const { shouldShowGlobal, changeShowGlobal } = this.props;
        const shouldTakeButtonFromLeft = shouldShowGlobal ? "panel-margined" : "panel-normalized"
        return (
            <div className={`commander-container ${shouldTakeButtonFromLeft}`}>
                <div className="circle-btns-container">
                    <button onClick={() => changeShowGlobal(!shouldShowGlobal)}
                         className={`commander-circle-btn ${shouldShowGlobal ? "hover-btn" : null}`}>
                        <i className="fa fa-cogs"></i>
                    </button>
                </div>
        
               

            </div>
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
  
