import React, { Component } from "react";
import Icon from "./Icon";
import LoaderHorizontal from "./LoaderHorizontal";

class SmoothTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      construct: props.construct
    };
  }
  deepenFunction(func, ...args) {
    return () => func(...args);
  }
  generateToolBox(object, toolBoxColumn) {
    return toolBoxColumn.toolBox.map((button, index) => (
      <button
        key={button.icon.icon}
        onClick={this.deepenFunction(button.click, object)}
      >
        <Icon {...button.icon} />
      </button>
    ));
  }
  generateOperators() {
    return this.state.construct.operators.map((operator, index) => (
      <button key={index} onClick={this.deepenFunction(operator.click)}>
        {operator.pretty}
      </button>
    ));
  }
  generateLegend() {
    return this.state.construct.columns.map((column, index) => (
      <th key={column.field + index}>{column.pretty}</th>
    ));
  }
  generateRow(object) {
    const { construct } = this.state;
    return (
      <tr
        key={object[construct.keyField]}
        className={
          "smooth-row" +
          (construct.rowClass !== undefined ? " " + construct.rowClass : "")
        }
      >
        {construct.columns.map((column, index) => {
          if (column.field !== undefined)
            return (
              <td
                key={column.field}
                className="smooth-cell"
                style={{ width: column.width + "%" }}
              >
                {column.multiState === undefined
                  ? object[column.field]
                  : column.multiState[object[column.field]]}
              </td>
            );
          else if (column.toolBox !== undefined)
            return (
              <td
                key="____toolBox"
                className="smooth-cell"
                style={{ width: column.width + "%" }}
              >
                {this.generateToolBox(object, column)}
              </td>
            );
        })}
      </tr>
    );
  }
  render() {
    const { construct } = this.state;
    let list, empty = false;
    if(this.props.data !== undefined) {
      list = this.props.data.map((object, index) =>
        this.generateRow(object)
      );
    }
    else{
      empty = true;
    }
    return (
      <div className="smooth-table">
        <div className="smooth-operator">{this.generateOperators()}</div>
        { this.props.loading && <LoaderHorizontal/> }
        <table
          className={
            construct.tableClass !== undefined ? " " + construct.tableClass : ""
          }
        >
          <thead>
            <tr className="smooth-row">{this.generateLegend()}</tr>
          </thead>
          <tbody>{list}</tbody>
        </table>
        { empty && <div className="smooth-footer">Brak danych bądź wyników</div> }
      </div>
    );
  }
}

export default SmoothTable;
