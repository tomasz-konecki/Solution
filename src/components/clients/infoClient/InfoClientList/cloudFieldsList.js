import React, { Component } from "react";
import "./InfoClientList.scss";

class CloudFieldsList extends Component {
  state = {
    opened: false,
    fields: []
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.fields !== nextProps.fields) {
      this.setState({
        fields: nextProps.fields
      })
    }
  }

  toogleFieldsList = () => {
    this.setState({
      opened: !this.state.opened
    })
  }

  render() {
    return (
      <div className="cloud-fields">
        <span className="cloud-name" onClick={this.toogleFieldsList}>
              {this.props.item.name ? this.props.item.name : this.props.item.firstName + " " + this.props.item.lastName}
              {this.state.opened && this.state.fields.length > 0 ? <i className="fas fa-caret-up arrow"></i> : <i className="fas fa-caret-down arrow"></i>}
        </span>
        {this.state.opened && this.state.fields.length > 0 && this.state.fields.map((field, index) => {
          return (
          <div key={index} className='field-container'>
            <span className="field-name">
              {field.name}:
            </span>
            <span className="field-content">
              {field.content}
            </span>
          </div>)
        })}
      </div>
    );
  }
}

export default CloudFieldsList;
