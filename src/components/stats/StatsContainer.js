import React, { Component } from "react";
import WebApi from "../../api";
import C3Chart from "react-c3js";
import "c3/c3.min.css";
import IntermediateBlock from "./../common/IntermediateBlock";
import { translate } from "react-translate";

const SIZE_MOBILE = {
  width: 270
};

const SIZE_DESKTOP = {
  height: 240,
  width: 480
};

class StatsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      resultBlock: {},
      windowWidth: 0,
      windowHeight: 0
    };
  }

  componentDidMount() {
    this.loadStats();

    var w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName("body")[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height =
        w.innerHeight || documentElement.clientHeight || body.clientHeight;

    this.setState({
      windowWidth: width,
      windowHeight: height
    });
  }

  loadStats = () => {
    WebApi.stats.get
      .basic()
      .then(result => {
        this.setState({
          loaded: true,
          resultBlock: result,
          stats: result.extractData()
        });
      })
      .catch(result => {
        this.setState({
          loaded: true,
          resultBlock: result,
          stats: {}
        });
      });
  };

  createDevChart = t => {
    const { stats } = this.state;
    const localizations = stats.localizations;
    let cols = [];

    localizations &&
      Object.entries(localizations).map(
        ([_i, { localization, count }], index) => {
          cols.push([localization, count]);
        }
      );
    const data = {
      type: "pie",
      columns: cols
    };

    const tooltip = {
      format: {
        value: function(value, ratio, id) {
          return `${value}`;
        }
      }
    };

    return (
      <span className="chart-container">
        <span>{t("DevLocalization")}</span>
        <C3Chart
          data={data}
          size={this.state.windowWidth < 500 ? SIZE_MOBILE : SIZE_DESKTOP}
          tooltip={tooltip}
        />
      </span>
    );
  };

  createEWPChart = t => {
    let cols = [
      [t("Without"), this.state.stats.employees.withoutProjects],
      [t("With"), this.state.stats.employees.withProjects]
    ];
    const data = {
      type: "pie",
      columns: cols
    };

    const tooltip = {
      format: {
        value: function(value, ratio, id) {
          return `${value}`;
        }
      }
    };

    return (
      <span className="chart-container">
        <span>{t("EmployeesWithoutProjects")}</span>
        <C3Chart
          data={data}
          size={this.state.windowWidth < 500 ? SIZE_MOBILE : SIZE_DESKTOP}
          tooltip={tooltip}
        />
      </span>
    );
  };

  createPAChart = t => {
    let cols = [
      [t("Active"), this.state.stats.projects.active],
      [t("Archive"), this.state.stats.projects.inactive]
    ];
    const data = {
      type: "pie",
      columns: cols
    };

    const tooltip = {
      format: {
        value: function(value, ratio, id) {
          return `${value}`;
        }
      }
    };

    return (
      <span className="chart-container">
        <span>{t("ActiveProjects")}</span>
        <C3Chart
          data={data}
          size={this.state.windowWidth < 500 ? SIZE_MOBILE : SIZE_DESKTOP}
          tooltip={tooltip}
        />
      </span>
    );
  };

  createFTEChart = t => {
    let cols = [
      [t("UnUsed"), this.state.stats.employeesFte.unusedFte],
      [t("Used"), this.state.stats.employeesFte.usedFte]
    ];
    const data = {
      type: "pie",
      columns: cols
    };

    const tooltip = {
      format: {
        value: function(value, ratio, id) {
          return `${value}`;
        }
      }
    };

    return (
      <span className="chart-container">
        <span>{t("EmployeesFTE")}</span>
        <C3Chart
          data={data}
          size={this.state.windowWidth < 500 ? SIZE_MOBILE : SIZE_DESKTOP}
          tooltip={tooltip}
        />
      </span>
    );
  };

  pullDOM = () => {
    const { t } = this.props;
    return (
      <div className="content-container stats-container">
        {this.createDevChart(t)}
        {this.createEWPChart(t)}
        {this.createPAChart(t)}
        {this.createFTEChart(t)}
      </div>
    );
  };

  render() {
    const { resultBlock } = this.state;
    return (
      <IntermediateBlock
        loaded={this.state.loaded}
        render={this.pullDOM}
        resultBlock={resultBlock}
        _className="content-container"
      />
    );
  }
}

export default translate("StatsContainer")(StatsContainer);
