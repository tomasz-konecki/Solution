import React from 'react'
import './fteBar.scss';
import { calculateFteBarWidth, valuesArray } from './index';
import WebApi from "../../../../api/index";

class FteBar extends React.PureComponent{
    state = {
        mark: calculateFteBarWidth(this.props.capacityLeft),
        isChanging: false
    }
    putMarkerDivs = range => {
        const divs = [];
        for(let i = 0; i < range; i++){
            const distance = 100/range;
            divs.push(
                <div key={i} onMouseMove={() => this.setState({mark: calculateFteBarWidth(valuesArray[i].percentage)})} 
                    onMouseOut={() => this.setState({mark: calculateFteBarWidth(this.props.capacityLeft)})}
                    style={{width: `${distance}%`, left: `${distance*i+1}%`}} 
                    className="marker">
                </div>
            )
        }
        return divs;
    }
    render(){
        const { mark } = this.state;
        return (
            <div className="fte-bar-container">
                <div style={{width: `${mark.percentage*100}%`}} className="fte-bar-progress"><span>{mark.mark}</span></div>
                <div style={{width: `${100 - (mark.percentage*100)}%`}} className="fte-bar-regress"></div>
                {this.putMarkerDivs(valuesArray.length).map(div => div)}
                <span>{mark.percentage * 100}%</span>
            </div>
        );
    }
}

export default FteBar;