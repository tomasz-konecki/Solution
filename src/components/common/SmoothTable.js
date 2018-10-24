import React, { Component } from "react";
import Icon from "./Icon";
import LoaderHorizontal from "./LoaderHorizontal";
import ReactPaginate from "react-paginate";
import Detail from "./Detail";
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import { Redirect } from "react-router-dom";

class SmoothTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toRaports: false,
      construct: props.construct,
      currentlySortedColumn: props.construct.defaultSortField,
      ascending: true,
      columns: {},
      columnFilters: {},
      columnFiltersLoaders: {},
      filterFieldOverrides: {},
      rowUnfurls: {},
      isQueryLoading: false,
      selectedOption: props.construct.showAllCheckbox
        ? "showAll"
        : "showActivated",
      searchQuery: "",
      sortingSettings: {
        Sort: props.construct.defaultSortField,
        Ascending: props.construct.defaultSortAscending
      },
      update: false,
      unfurl: props.construct.rowDetailUnfurl
    };
    this.constructingTableColumns();
    this.state.columns[props.construct.defaultSortField] =
      props.construct.defaultSortAscending;

    this.handlePageChange = this.handlePageChange.bind(this);
    this.removeFilters = this.removeFilters.bind(this);
    this.generateOperators = this.generateOperators.bind(this);
    this.generateSettings = this.generateSettings.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleColumnFilterChange = this.handleColumnFilterChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.initialState = Object.assign({}, this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.construct.columns !== this.state.construct.columns) {
      this.setState({ construct: nextProps.construct });
    }
  }

  constructingTableColumns() {
    this.props.construct.columns.map((column, index) => {
      if (column.field === undefined) return;

      let newField = {};
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
  }

  deepenFunction(func, ...args) {
    return event => {
      if (event.stopPropagation !== undefined) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
      }
      return func(...args, event);
    };
  }

  handleInputChange(event) {
    this.removeFilters();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (target.type === "radio") {
      this.setState(
        {
          selectedOption: value
        },
        () => {
          this.props.construct.pageChange(1, this.generateSettings());
        }
      );
    } else {
      this.setState(
        {
          [name]: value
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

  generateSettings() {
    let mainFilter = {};
    if (this.state.searchQuery !== "") {
      mainFilter["Query"] = this.state.searchQuery;
    }
    switch (this.state.selectedOption) {
      case "isDeleted":
        mainFilter["isDeleted"] = true;
        break;
      case "isNotActivated":
        mainFilter["isNotActivated"] = true;
        break;
      case "showActivated":
        mainFilter["isDeleted"] = false;
        break;
      case "showAll":
        mainFilter["isDeleted"] = null;
        break;

      default:
        break;
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

    if (this.props.getSettings) {
      this.props.getSettings(
        Object.assign({}, this.state.sortingSettings, mainFilter)
      );
    }

    if (this.props.handleChangeSettings) {
      this.props.handleChangeSettings(Object.assign({}, this.state.sortingSettings, mainFilter));
    }

    return Object.assign({}, this.state.sortingSettings, mainFilter);
  }

  handleSortColumnClick = field => {
    if (field !== undefined) {
      let oldFields = this.state.columns;
      oldFields[field] = !oldFields[field];
      this.setState(
        {
          columns: oldFields,
          currentlySortedColumn: field,
          sortingSettings: {
            Sort: field,
            Ascending: oldFields[field]
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
  };

  handlePageChange(paginator) {
    this.setState(
      {
        rowUnfurls: {}
      },
      () => {
        this.props.construct.pageChange(
          paginator.selected + 1,
          this.generateSettings()
        );
      }
    );
  }

  handleFilterDateChange() {}

  toolBoxButton(button, object) {
    return (
      <button
        key={button.icon.icon}
        title={button.title}
        onClick={this.deepenFunction(button.click, object)}
      >
        <Icon {...button.icon} />
      </button>
    );
  }

  generateToolBox(object, toolBoxColumn) {
    return toolBoxColumn.toolBox.map((button, index) => {
      if (button.comparator === undefined || button.comparator(object)) {
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
        value =
          rotated[event.target.value] === "null"
            ? null
            : rotated[event.target.value];
        break;
      }
      case "date": {
        value = event.format("YYYY-MM-DDTHH:mm:ss.SSS");
        break;
      }
    }
    columnFilters[field] = value;
    field === "hasAccount" &&
      value === "true" &&
      this.setState({ selectedOption: "showActivated" });
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
    if (object.hasAccount == false) {
    } else {
      const { redirectPath } = this.props.construct;
      if (redirectPath) {
        this.setState({ rowClickedId: object.id });
      } else {
        const { keyField } = this.props.construct;
        const { rowUnfurls } = this.state;

        if (rowUnfurls[index] === undefined) {
          rowUnfurls[index] = true;
        } else {
          rowUnfurls[index] = !rowUnfurls[index];
        }

        this.setState({
          rowUnfurls
        });
      }
    }
  }

  removeFilters() {
    let newState = this.initialState;
    newState.columnFilters = Object.assign(
      {},
      ...Object.keys(newState.columnFilters).map(k => ({ [k]: "" }))
    );
    this.setState(newState, () => {
      this.props.construct.pageChange(1, this.generateSettings());
    });
  }

  operatorButton(index, operator) {
    return (
      <button
        className="smooth-operator-add-button"
        key={index}
        onClick={this.deepenFunction(operator.click)}
      >
        {operator.pretty}
      </button>
    );
  }

  generateOperators() {
    let operators = [];
    let inputClasses = ["form-control"];
    if (this.state.isQueryLoading) inputClasses.push("loading");
    this.state.construct.operators.map((operator, index) => {
      if (operator.comparator === undefined || operator.comparator(operator))
        operators.push(this.operatorButton(index, operator));
    });
    if (this.props.construct.filtering) {
      operators.push(
        <span className="smooth-table-search-span" key={-1}>
          <input
            type="search"
            name="search"
            value={this.state.searchQuery}
            placeholder={this.props.t("Search")}
            onChange={this.handleQueryChange}
            className={inputClasses.join(" ")}
          />
        </span>
      );
      operators.push(
        <span className="smooth-table-remove-filters" key={-2}>
          <button onClick={this.removeFilters}>
            {this.props.t("DeleteFilters")}
          </button>
        </span>
      );
    }

    if (this.props.construct.showDeletedCheckbox) {
      operators.push(
        <span className="smooth-radio-span" key={-4}>
          <input
            id="radio2"
            name="radioButtons"
            type="radio"
            value="isDeleted"
            checked={this.state.selectedOption === "isDeleted"}
            onChange={this.handleInputChange}
          />
          <label className="smooth-radio-button1" htmlFor="radio2">
            {this.props.t("ShowDeleted")}
          </label>
        </span>
      );
    }
    if (this.props.construct.showNotActivatedAccountsCheckbox) {
      operators.push(
        <span className="smooth-radio-span" key={-5}>
          <input
            id="radio3"
            name="radioButtons"
            type="radio"
            value="isNotActivated"
            checked={this.state.selectedOption === "isNotActivated"}
            onChange={this.handleInputChange}
          />
          <label className="smooth-radio-button2" htmlFor="radio3">
            {this.props.t("ShowNotActivated")}
          </label>
        </span>
      );
    }
    if (this.props.construct.showActivatedCheckbox) {
      operators.push(
        <span className="smooth-radio-span" key={-6}>
          <input
            id="radio4"
            name="radioButtons"
            type="radio"
            value="showActivated"
            checked={this.state.selectedOption === "showActivated"}
            onChange={this.handleInputChange}
          />
          <label className="smooth-radio-button3" htmlFor="radio4">
            {this.props.t("ShowActivated")}{" "}
          </label>
        </span>
      );
    }
    if (this.props.construct.showAllCheckbox) {
      operators.push(
        <span key={-7} className="smooth-radio-span">
          <input
            id="radio5"
            name="radioButtons"
            type="radio"
            value="showAll"
            checked={this.state.selectedOption === "showAll"}
            onChange={this.handleInputChange}
          />
          <label className="smooth-radio-button3" htmlFor="radio5">
            {this.props.t("ShowAll")}
          </label>
        </span>
      );
    }

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
          key={index}
        >
          <span style={{ display: "inline-block", width: "95%" }}>
            {column.pretty}
            {this.generateSortingArrow(columns[currentlySortedColumn])}
          </span>
        </th>
      );
    else
      return (
        <th
          onClick={this.deepenFunction(
            this.handleSortColumnClick,
            column.field
          )}
          key={index}
        >
          {column.pretty}
        </th>
      );
  }

  generateLegend() {
    const { currentlySortedColumn, columns, construct } = this.state;
    return construct.columns.map((column, index) => {
      if (column.comparator === undefined || column.comparator(column))
        return this.tableHeader(currentlySortedColumn, columns, column, index);
    });
  }

  generateFieldFilter(column, classes) {
    switch (column.type) {
      case "text": {
        return (
          <input
            type={column.type}
            name={"__SEARCH_" + column.field}
            value={this.state.columnFilters[column.field]}
            placeholder={this.props.t("Search") + " " + column.pretty}
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
            disabled={this.state.selectedOption === "isDeleted"}
          >
            {this.state.selectedOption === "isDeleted"
              ? "-"
              : Object.values(column.multiState)
                  .reverse()
                  .map((stateValue, index) => {
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
            placeholderText={this.props.t("Search") + " " + column.pretty}
            todayButton={this.props.t("Today")}
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
            value={
              this.state.columnFilters[column.field] !== ""
                ? new Date(
                    this.state.columnFilters[column.field]
                  ).toLocaleDateString()
                : ""
            }
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
        if (object.employeeShared && column.field === "firstName") {
          return (
            <span>
              {" "}
              {object[column.field]}{" "}
              <i
                className="fa fa-share-alt"
                style={{ color: "red" }}
                title={"Udostępniony przez " + object.employeeSharedBy}
              />
            </span>
          );
        } else {
          return object[column.field];
        }
      case "multiState":
        if (object.isDeleted) {
          return this.props.t("Deleted");
        } else {
          return column.multiState[object[column.field]];
        }
      case "date":
        return new Date(object[column.field]).toLocaleDateString();
    }
  }

  generateRow(object, index) {
    const { construct, unfurl } = this.state;

    let classes = ["smooth-row"];
    let unfurled = this.state.rowUnfurls[index];

    let payload = [];

    if (this.props.construct.disabledRowComparator !== undefined) {
      const isDisabled = this.props.construct.disabledRowComparator(object);
      if (isDisabled) classes.push("smooth-row-disabled");
    }

    if (construct.rowClass !== undefined) {
      classes.push(construct.rowClass);
    }

    payload.push(
      <tr
        key={object[construct.keyField]}
        className={
          object.hasAccount
            ? classes.join(" ")
            : (classes.push("set-pointer"), classes.join(" "))
        }
        onClick={this.deepenFunction(this.handleRowClick, object, index)}
      >
        {construct.columns.map((column, index) => {
          if (column.field !== undefined) {
            return (
              <td
                key={index + column.field}
                className="smooth-cell"
                style={{ width: column.width + "%" }}
                title={object.name}
              >
                {this.generateCell(column, object)}
              </td>
            );
          } else if (column.toolBox !== undefined) {
            return (
              <td
                key={"____toolBox_" + index}
                className="smooth-cell smooth-text-right"
                style={{ width: column.width + "%" }}
              >
                {this.generateToolBox(object, column)}
              </td>
            );
          } else if (column.manualResolver !== undefined) {
            return (
              <td
                key={"____manualResolver_" + index}
                className="smooth-cell smooth-text-right"
                style={{ width: column.width + "%" }}
              >
                {column.manualResolver(object, column)}
              </td>
            );
          }
        })}
      </tr>
    );

    if (unfurl && !this.state.update)
      payload.push(
        <tr key={"____unfurl_" + index}>
          {unfurled ? (
            <td
              colSpan={this.props.construct.columns.length}
              className="smooth-unfurl-content"
            >
              {React.createElement(this.props.construct.unfurler, {
                toUnfurl: object,
                handles: this.props.construct.handles,
                update: this.forceAnUpdate
              })}
            </td>
          ) : null}
        </tr>
      );

    return payload;
  }

  forceAnUpdate = () => {
    const unfurls = JSON.parse(JSON.stringify(this.state.rowUnfurls));
    this.setState(
      {
        update: !this.state.update,
        rowUnfurls: {},
        unfurl: false
      },
      () => {
        this.setState({
          rowUnfurls: unfurls,
          update: !this.state.update,
          unfurl: true
        });
      }
    );
  };

  setToRaports = () => {
    this.setState({
      toRaports: true
    });
  };
  render() {
    const { construct } = this.state;
    const { showRaportButton, t } = this.props;
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
    if (this.state.toRaports === true) {
      return <Redirect push to="/main/reports" />;
    }
    if (this.state.rowClickedId) {
      return (
        <Redirect
          push
          to={this.props.construct.redirectPath + this.state.rowClickedId}
        />
      );
    }

    return (
      <div className="smooth-table">
        <div className="d-flex">
          <div className="smooth-operator">
            {this.generateOperators()}
            {showRaportButton && (
              <button
                className="dcmt-button raport-button ml-auto mt-3 mr-3"
                onClick={this.setToRaports}
              >
                {this.props.t("Reports")}
              </button>
            )}
          </div>
        </div>
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
        {empty && (
          <div className="smooth-footer">{this.props.t("NoDataOrResults")}</div>
        )}
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

SmoothTable.propTypes = {
  construct: PropTypes.shape({
    rowClass: PropTypes.string.isRequired,
    tableClass: PropTypes.string.isRequired,
    keyField: PropTypes.string.isRequired,
    pageChange: PropTypes.func.isRequired,
    defaultSortField: PropTypes.string.isRequired,
    defaultSortAscending: PropTypes.bool.isRequired,
    filtering: PropTypes.bool.isRequired,
    filterClass: PropTypes.string,
    rowDetailUnfurl: PropTypes.bool,
    unfurler: PropTypes.func,
    disabledRowComparator: PropTypes.func,
    showRadioButtons: PropTypes.bool,
    handles: PropTypes.objectOf(PropTypes.func),
    operators: PropTypes.arrayOf(
      PropTypes.shape({
        pretty: PropTypes.string.isRequired,
        click: PropTypes.func
      })
    ),
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        width: PropTypes.number.isRequired,
        field: PropTypes.string,
        pretty: PropTypes.string.isRequired,
        type: PropTypes.string,
        filter: PropTypes.bool,
        filterFieldOverride: PropTypes.string,
        multiState: PropTypes.object,
        toolBox: PropTypes.arrayOf(
          PropTypes.shape({
            icon: PropTypes.object.isRequired,
            title: PropTypes.string.isRequired,
            click: PropTypes.func.isRequired,
            comparator: PropTypes.func
          })
        )
      })
    )
  }),
  dispatch: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired
};

export default translate("SmoothTable")(SmoothTable);
