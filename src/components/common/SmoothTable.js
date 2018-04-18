import React, { Component } from "react";
import Icon from "./Icon";
import LoaderHorizontal from "./LoaderHorizontal";
import ReactPaginate from "react-paginate";
import Detail from "./Detail";
import DatePicker from "react-datepicker";
import moment from "moment";

class SmoothTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      construct: props.construct,
      currentlySortedColumn: props.construct.defaultSortField,
      ascending: true,
      columns: {},
      columnFilters: {},
      columnFiltersLoaders: {},
      filterFieldOverrides: {},
      rowUnfurls: {},
      isQueryLoading: false,
      searchQuery: "",
      sortingSettings: {
        Sort: props.construct.defaultSortField,
        Ascending: props.construct.defaultSortAscending
      }
    };

    props.construct.columns.map((column, index) => {
      if (column.field === undefined) return;

      let newField = {};
      let newDateFilters = {};
      let newFilterField = {};
      let newFilterFieldLoaders = {};
      let newFilterFieldOverrides = {};

      newField[column.field] = true;
      newFilterField[column.field] = "";
      newFilterFieldLoaders[column.field] = false;

      if (column.filterFieldOverride !== undefined) {
        newFilterFieldOverrides[column.field] = column.filterFieldOverride;
      }

      Object.assign(this.state.columns, newField);
      Object.assign(this.state.columnFilters, newFilterField);
      Object.assign(this.state.filterFieldOverrides, newFilterFieldOverrides);
    });

    this.state.columns[props.construct.defaultSortField] =
      props.construct.defaultSortAscending;

    this.handleSortColumnClick = this.handleSortColumnClick.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.removeFilters = this.removeFilters.bind(this);
    this.generateOperators = this.generateOperators.bind(this);
    this.generateSettings = this.generateSettings.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleColumnFilterChange = this.handleColumnFilterChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);

    this.initialState = Object.assign({}, this.state);
  }

  deepenFunction(func, ...args) {
    return event => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return func(...args, event);
    };
  }

  generateSettings() {
    let mainFilter = {};
    if (this.state.searchQuery !== "") {
      mainFilter["Query"] = this.state.searchQuery;
    }
    if (Object.keys(this.state.columnFilters).length > 0) {
      mainFilter[this.props.construct.filterClass] = {};
      Object.entries(this.state.columnFilters).map((keyval, index) => {
        let fieldName = keyval[0];
        if (this.state.filterFieldOverrides[fieldName] !== undefined)
          fieldName = this.state.filterFieldOverrides[fieldName];
        if (keyval[1] !== "")
          mainFilter[this.props.construct.filterClass][fieldName] = keyval[1];
      });
    }
    return Object.assign({}, this.state.sortingSettings, mainFilter);
  }

  handleSortColumnClick(field) {
    if (field !== undefined) {
      let oldFields = this.state.columns;
      oldFields[field] = !oldFields[field];
      this.setState(
        {
          columns: oldFields,
          currentlySortedColumn: field,
          sortingSettings: {
            Sort: field,
            Ascending: this.state.columns[field]
          },
          rowUnfurls: {}
        },
        () => {
          this.props.construct.pageChange(
            this.props.currentPage,
            this.generateSettings()
          );
        }
      );
    }
  }

  handlePageChange(paginator) {
    this.setState({
      rowUnfurls: {}
    }, () => {
      this.props.construct.pageChange(
        paginator.selected + 1,
        this.generateSettings()
      );
    });
  }

  handleFilterDateChange() {}

  toolBoxButton(button, object) {
    return (
      <button
        key={button.icon.icon}
        onClick={this.deepenFunction(button.click, object)}
      >
        <Icon {...button.icon} />
      </button>
    );
  }

  generateToolBox(object, toolBoxColumn) {
    return toolBoxColumn.toolBox.map((button, index) => {
      if(button.comparator === undefined || button.comparator(object)){
        return this.toolBoxButton(button, object);
      }
    });
  }

  handleQueryChange(event) {
    let value = event.target.value;
    this.setState(
      {
        searchQuery: event.target.value,
        isQueryLoading: true
      },
      () => {
        setTimeout(() => {
          if (
            (this.state.searchQuery === value && value !== "") ||
            value === ""
          ) {
            this.props.construct.pageChange(1, this.generateSettings());
            this.setState({
              isQueryLoading: false
            });
          }
        }, 1000);
      }
    );
  }

  swapKeysForValues(object) {
    let payload = {};
    for (let key in object) {
      payload[object[key]] = key;
    }
    return payload;
  }

  handleColumnFilterChange(column, type = "text", event) {
    let { field, multiState } = column;
    let { columnFilters, columnFiltersLoaders } = this.state;

    let value,
      offset = 1;

    switch (type) {
      case "text": {
        value = event.target.value;
        offset = 2000;
        break;
      }
      case "multiState": {
        let rotated = this.swapKeysForValues(multiState);
        value = rotated[event.target.value];
        break;
      }
      case "date": {
        value = event.format("YYYY-MM-DDTHH:mm:ss.SSS");
        break;
      }
    }

    columnFilters[field] = value;
    columnFiltersLoaders[field] = true;

    this.setState(
      {
        columnFilters,
        columnFiltersLoaders,
        rowUnfurls: {}
      },
      () => {
        setTimeout(() => {
          if (
            (this.state.columnFilters[field] === value && value !== "") ||
            value === ""
          ) {
            columnFiltersLoaders[field] = false;
            this.setState(
              {
                columnFiltersLoaders
              },
              () => {
                this.props.construct.pageChange(1, this.generateSettings());
              }
            );
          }
        }, offset);
      }
    );
  }

  handleRowClick(object, index, event) {
    const { keyField } = this.props.construct;
    const { rowUnfurls } = this.state;

    if(rowUnfurls[index] === undefined){
      rowUnfurls[index] = true;
    } else {
      rowUnfurls[index] = !rowUnfurls[index];
    }

    this.setState({
      rowUnfurls
    });
  }

  removeFilters() {
    let newState = this.initialState;
    newState.columnFilters = Object.assign(
      {},
      ...Object.keys(newState.columnFilters).map(k => ({ [k] : "" }))
    );
    this.setState(newState, () => {
      this.props.construct.pageChange(1, this.generateSettings());
    });
  }

  operatorButton(index, operator) {
    return (
      <button key={index} onClick={this.deepenFunction(operator.click)}>
        {operator.pretty}
      </button>
    );
  }

  generateOperators() {
    let operators = [];
    let inputClasses = ["form-control"];
    if (this.state.isQueryLoading) inputClasses.push("loading");
    this.state.construct.operators.map((operator, index) =>
      operators.push(this.operatorButton(index, operator))
    );
    operators.push(
      <input
        key={-1}
        type="text"
        name="search"
        value={this.state.searchQuery}
        placeholder="Szukaj"
        required
        onChange={this.handleQueryChange}
        className={inputClasses.join(" ")}
      />
    );
    operators.push(
      <button key={-2} onClick={this.removeFilters}>
        USUŃ FILTRY
      </button>
    );
    return operators;
  }

  generateSortingArrow(asc) {
    const ascending = asc ? "arrow-down" : "arrow-up";
    return (
      <span className="smooth-arrow-right">
        <Icon icon={ascending} />
      </span>
    );
  }

  tableHeader(currentlySortedColumn, columns, column, index) {
    if (currentlySortedColumn === column.field)
      return (
        <th
          onClick={this.deepenFunction(
            this.handleSortColumnClick,
            column.field
          )}
          key={column.field + index}
        >
          {column.pretty}
          {this.generateSortingArrow(columns[currentlySortedColumn])}
        </th>
      );
    else
      return (
        <th
          onClick={this.deepenFunction(
            this.handleSortColumnClick,
            column.field
          )}
          key={column.field + index}
        >
          {column.pretty}
        </th>
      );
  }

  generateLegend() {
    const { currentlySortedColumn, columns, construct } = this.state;
    return construct.columns.map((column, index) =>
      this.tableHeader(currentlySortedColumn, columns, column, index)
    );
  }

  generateFieldFilter(column, classes) {
    switch (column.type) {
      case "text": {
        return (
          <input
            type={column.type}
            name={"__SEARCH_" + column.field}
            value={this.state.columnFilters[column.field]}
            placeholder={"Szukaj " + column.pretty}
            required
            onChange={this.deepenFunction(
              this.handleColumnFilterChange,
              column,
              column.type
            )}
            className={classes}
          />
        );
      }
      case "multiState": {
        return (
          <select
            name={"__MULTISTATE_" + column.field}
            className="form-control form-control-sm manual-input"
            onChange={this.deepenFunction(
              this.handleColumnFilterChange,
              column,
              column.type
            )}
          >
            <option />
            {Object.values(column.multiState).map((stateValue, index) => {
              return <option key={index}>{stateValue}</option>;
            })}
          </select>
        );
      }
      case "date": {
        return (
          <DatePicker
            selectsStart
            locale="pl"
            className="form-control form-control-sm manual-input"
            dateFormat="YYYY-MM-DD"
            todayButton={"Dzisiaj"}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            name={"__SEARCH_" + column.field}
            onChange={this.deepenFunction(
              this.handleColumnFilterChange,
              column,
              column.type
            )}
          />
        );
      }
    }
  }

  generateFieldSearchRow() {
    let columns = [];
    let inputClasses = ["form-control", "form-control-sm"];
    let loaderClass = "loading";
    this.props.construct.columns.map((column, index) => {
      if (
        column.field !== undefined &&
        column.type !== undefined &&
        column.filter
      ) {
        let additionalClass = this.state.columnFiltersLoaders[column.field]
          ? loaderClass
          : "";
        columns.push(
          <td
            key={"__SEARCH_" + column.field}
            className="smooth-cell smooth-text-center-row"
            style={{ width: column.width + "%" }}
          >
            {this.generateFieldFilter(
              column,
              [...inputClasses, additionalClass].join(" ")
            )}
          </td>
        );
      } else columns.push(<td key={index} />);
    });
    return <tr key="__FILTER_ROW">{columns}</tr>;
  }

  generateCell(column, object) {
    switch (column.type) {
      case "text":
        return object[column.field];
      case "multiState":
        return column.multiState[object[column.field]];
      case "date":
        return moment(object[column.field]).format("YYYY-MM-DD");
    }
  }

  generateRow(object, index) {
    const { construct } = this.state;

    let classes = ['smooth-row'];
    let unfurled = this.state.rowUnfurls[index];
    let unfurl = construct.rowDetailUnfurl;

    let payload = [];

    if(this.props.construct.disabledRowComparator !== undefined){
      const isDisabled = this.props.construct.disabledRowComparator(object);
      if(isDisabled) classes.push('smooth-row-disabled');
    }

    if(construct.rowClass !== undefined){
      classes.push(construct.rowClass);
    }

    payload.push(<tr
      key={object[construct.keyField]}
      className={classes.join(' ')}
      onClick={this.deepenFunction(this.handleRowClick, object, index)}
    >
      {construct.columns.map((column, index) => {
        if (column.field !== undefined) {
          return (
            <td
              key={column.field}
              className="smooth-cell"
              style={{ width: column.width + "%" }}
            >
              {this.generateCell(column, object)}
            </td>
          );
        } else if (column.toolBox !== undefined){
          return (
            <td
              key="____toolBox"
              className="smooth-cell smooth-text-right"
              style={{ width: column.width + "%" }}
            >
              {this.generateToolBox(object, column)}
            </td>
          );
        }
      })}
    </tr>);

    if(unfurl) payload.push(<tr
      key={index}
    >
      {
        (unfurled) ?
        <td colSpan={this.props.construct.columns.length} className="smooth-unfurl-content">
          {
            React.createElement(this.props.construct.unfurler, {
              toUnfurl: object,
              key: index,
              handles: this.props.construct.handles
            })
          }
        </td>
        :
        null
      }
    </tr>);

    return payload;
  }

  render() {
    const { construct } = this.state;
    let list = [],
      empty = false;
    list.push(this.generateFieldSearchRow());
    if (this.props.data !== undefined && this.props.data[0] !== undefined) {
      list = list.concat(
        this.props.data.map((object, index) => this.generateRow(object, index))
      );
    } else {
      empty = true;
    }
    return (
      <div className="smooth-table">
        <div className="smooth-operator">{this.generateOperators()}</div>
        <div className="smooth-loader-top">
          {this.props.loading && <LoaderHorizontal />}
        </div>
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
        {this.props.construct.pageChange !== undefined &&
          1 !== this.props.totalPageCount && (
            <ReactPaginate
              previousLabel={
                <span className="smooth-navigator">
                  <Icon icon="arrow-left" />
                </span>
              }
              nextLabel={
                <span className="smooth-navigator">
                  <Icon icon="arrow-right" />
                </span>
              }
              breakLabel={<a href="">...</a>}
              breakClassName={"break-me"}
              forcePage={this.props.currentPage - 1}
              pageCount={this.props.totalPageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={"smooth-paginator"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          )}
        <div className="smooth-loader-bottom">
          {this.props.loading && <LoaderHorizontal />}
        </div>
      </div>
    );
  }
}

export default SmoothTable;
