import React, { Component } from "react";
import Icon from "./Icon";
import LoaderHorizontal from "./LoaderHorizontal";
import ReactPaginate from 'react-paginate';

class SmoothTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      construct: props.construct
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  deepenFunction(func, ...args) {
    return () => func(...args);
  }

  handlePageChange(paginator){
    this.props.construct.pageChange(paginator.selected + 1);
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
    let list,
      empty = false;
    if (this.props.data !== undefined && this.props.data[0] !== undefined) {
      list = this.props.data.map((object, index) => this.generateRow(object));
    } else {
      empty = true;
    }
    return (
      <div className="smooth-table">
        <div className="smooth-operator">{this.generateOperators()}</div>
        <div className="smooth-loader-top">{this.props.loading && <LoaderHorizontal />}</div>
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
        {empty && <div className="smooth-footer">Brak danych bądź wyników</div>}
        { 1 !== this.props.totalPageCount &&
        <ReactPaginate
          previousLabel={<span className="smooth-navigator"><Icon icon="arrow-left"/></span>}
          nextLabel={<span className="smooth-navigator"><Icon icon="arrow-right"/></span>}
          breakLabel={<a href="">...</a>}
          breakClassName={"break-me"}
          forcePage={this.props.currentPage - 1}
          pageCount={this.props.totalPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageChange}
          containerClassName={"smooth-paginator"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} /> }
        <div className="smooth-loader-bottom">{this.props.loading && <LoaderHorizontal />}</div>
      </div>
    );
  }
}

export default SmoothTable;
