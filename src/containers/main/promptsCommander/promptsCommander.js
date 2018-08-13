import React from 'react'
import './promptsCommander.scss';
import { connect } from 'react-redux';
class PromptsCommander extends React.Component{
    state = {

    }
    render(){
        return (
            <div className="commander-container">

            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
    };
  };
  export default connect(mapStateToProps, null)(PromptsCommander);
  
