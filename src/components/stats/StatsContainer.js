import React, { Component } from 'react';
import WebApi from "../../api";
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import IntermediateBlock from './../common/IntermediateBlock';

class StatsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      resultBlock: {}
    };
  }

  componentDidMount() {
    this.loadStats();
  }

  loadStats = () => {
    WebApi.stats.get.basic()
      .then((result) => {
        this.setState({
          loaded: true,
          resultBlock: result,
          stats: result.extractData()
        });
      })
      .catch((result) => {
        this.setState({
          loaded: true,
          resultBlock: result,
          stats: {}
        });
      });
  }
  createChart = () => {
    let cols = [];
    Object.entries(this.state.stats.localizations).map(([_i, {localization, count}], index) => {
      cols.push([localization, count]);
    });
    const data = {
      type : 'pie',
      columns: cols
    };

    const size = {
      height: 240,
      width: 480
    };

    return <div className="content-container stats-container">
      <span className="chart-container">
        <span>
          Lokalizacje developerów
        </span>
        <C3Chart data={data} size={size} />
      </span>
    </div>;
  }
  render() {
    return <IntermediateBlock
      loaded={this.state.loaded}
      render={this.createChart}
      resultBlock={this.props.replyBlock}
      _className="content-container"
    />;
  }
}

export default StatsContainer;
