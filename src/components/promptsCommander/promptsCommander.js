import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
class PromptsCommander extends React.Component{
    state = {

    }
    render(){
        return (
            <div className="commander-container">
                <div className="circle-btns-container">
                    <button className="commander-circle-btn">
                        <i className="fa fa-cogs"></i>
                    </button>
                    <span className="stats-icon"></span>
                    <span className="stats-icon"></span>
                </div>
                
                
                <div className="commander-content">
                    <nav></nav>
                    <div></div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
    };
  };
  export default connect(mapStateToProps, null)(PromptsCommander);
  
