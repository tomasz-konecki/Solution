import React from 'react'
import './quaters.scss';
import Button from '../../../common/button/button';

class Quaters extends React.PureComponent{
    state = {
        listToShowIndex: null,
        currentPage: 1, 
        watchedRecords: 0
    }
    showDetails = index => {
        const newIndex = this.state.listToShowIndex === index ? null : index;
        this.setState({listToShowIndex: newIndex})
    }

    render(){
        const { paginationLimit, quarterTalks } = this.props;
        const { listToShowIndex, currentPage, watchedRecords } = this.state;
        return (
            <div className="quaters-container">
                {quarterTalks && 
                    quarterTalks.length > 0 ?
                    <React.Fragment>
                    <h2>Rozmowy kwartalne <span>({quarterTalks.length})</span></h2>
                    <ul>
                        {quarterTalks.map((item, index) => {
                            return ( 
                                (index >= paginationLimit * (currentPage-1) && index < paginationLimit * currentPage) &&   
                                <li onClick={() => this.showDetails(index)} key={index}>
                                    {index === listToShowIndex && 
                                        <div className="clicked-row"></div>
                                    }
                                    <span><b>({item.quarter})</b> {item.year}</span>
                                    <span>{item.employeeId}</span>
                                    {index === listToShowIndex && 
                                        <div className="aditional-informations">
                                            <ul>
                                                {item.quarterTalkQuestionItems.map(questionItem => {
                                                    return (
                                                        <li key={questionItem.id}>
                                                            <p>{questionItem.question}</p>
                                                            <article>{questionItem.answer}</article>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    }
                                </li>
                            )
                        })} 
                    </ul> 

                    {quarterTalks.length > paginationLimit && 
                    <div className="pagination-options">
                        {watchedRecords !== 0 && 
                            <i onClick={() => this.setState({currentPage: currentPage-1, watchedRecords: watchedRecords-paginationLimit})} className="fa fa-arrow-left"></i>
                        }
                        {watchedRecords - (paginationLimit - (quarterTalks.length % paginationLimit)) + paginationLimit !== quarterTalks.length &&
                            <i onClick={() => this.setState({currentPage: currentPage+1, watchedRecords: watchedRecords+paginationLimit})} className="fa fa-arrow-right"></i>
                        }
                    </div>
                    }
                    <Button title="Dodaj" mainClass="option-btn normal-btn" />
                    </React.Fragment> : 
                    <div className="empty-quater-talks">
                        <div>
                            <span>Brak rozmów kwartalnych</span>
                            <i className="fa fa-comments"></i>
                        </div>
                    </div>
                }
          </div>
        );
    }
}

export default Quaters;