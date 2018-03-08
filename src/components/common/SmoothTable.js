import React, { Component } from 'react';
import Icon from './Icon';

class SmoothTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      construct: {
        optionalClass: "user-block",
        keyField: "id",
        columns: [
          { width: 2, field: "firstName" },
          { width: 3, field: "lastName" },
          { width: 1, field: "email" },
          { width: 1, field: "phoneNumber" },
          { width: 0, toolBox: [
            { icon: { icon: "times" }, click: () => {} },
            { icon: { icon: "edit", iconType: "far" }, click: () => { alert('kappa'); } }
          ] }
        ]
      },
      data: props.data
    };
  }
  generateToolBox(toolBoxColumn) {
    return toolBoxColumn.toolBox.map((button, index) => (
      <button key={button.icon.icon} onClick={button.click}><Icon {...button.icon}/></button>
    ));
  }
  generateRow(object) {
    const { construct } = this.state;
    return (
      <div key={object[construct.keyField]} className="smooth-row user-block">
        {construct.columns.map((column, index) => {
          if(column.field !== undefined)
            return <div key={column.field} className={`smooth-cell smooth-${column.width}x`}>{object[column.field]}</div>
          else if(column.toolBox !== undefined)
            return <div key={column.field} className={`smooth-cell smooth-${column.width}x`}>{this.generateToolBox(column)}</div>
        })}
      </div>
    );
  }
  render() {
    const list = this.state.data.map((object, index) => this.generateRow(object));
    return (
      <div className="smooth-table users-list-container">
        {list}
      </div>
    );
  }
}

export default SmoothTable;
