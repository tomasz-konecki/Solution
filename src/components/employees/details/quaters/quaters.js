import React from 'react'
import './quaters.scss';
import Button from '../../../common/button/button';
import ConfirmModal from '../../../common/confimModal/confirmModal';
import Spinner from '../../../common/spinner/spinner';
import OperationStatusPrompt from '../../../form/operationStatusPrompt/operationStatusPrompt';
class Quaters extends React.PureComponent{
    state = {
        listToShowIndex: null,
        currentPage: 1, 
        watchedRecords: 0,
        showDeleteModal: false,
        deletingQuater: false,
        activatingQuater: false
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.deleteQuaterStatus){
            this.setState({deletingQuater: false, showDeleteModal: false, listToShowIndex: null});
        }
        else if(nextProps.deleteQuaterErrors !== this.props.deleteQuaterErrors)
            this.setState({deletingQuater: false});
    }
    
    showDetails = index => {
        const newIndex = this.state.listToShowIndex === index ? null : index;
        this.setState({listToShowIndex: newIndex})
    }
    deleteQuaters = () => {
        this.setState({deletingQuater: true});
        this.props.deleteQuaterACreator(this.state.listToShowIndex+1, this.props.employeeId);
    }

    activateQuaters = () => {
        this.setState({activatingQuater: true});
        
    }
    render(){
        const { paginationLimit, quarterTalks, deleteQuaterStatus, deleteQuaterErrors } = this.props;
        const { listToShowIndex, currentPage, watchedRecords, showDeleteModal, deletingQuater, activatingQuater } = this.state;
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
                                <li className={item.isDeleted === false ? "is-deleted-quater" : "is-activate-quater"}
                                onClick={() => this.showDetails(index)} key={index}>
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
                        {listToShowIndex !== null && quarterTalks[listToShowIndex].isDeleted === false &&
                            <i onClick={() => this.setState({showDeleteModal: true})} className="fa fa-trash"></i>
                        }

                        {listToShowIndex !== null && quarterTalks[listToShowIndex].isDeleted === true && 
                            <i onClick={this.activateQuaters} className="fa fa-check"></i>
                        }

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

               
                <ConfirmModal operationName="Usuń" operation={this.deleteQuaters}
                open={showDeleteModal} header="Czy jestes pewny, że chcesz usunąć rozmowę?"
                onClose={() => this.setState({showDeleteModal: false})}>
                    {deletingQuater && <Spinner />}
                </ConfirmModal>

                {deleteQuaterStatus !== null && deleteQuaterStatus !== undefined && 
                <OperationStatusPrompt
                    operationPromptContent={deleteQuaterStatus ? "Pomyślnie wykonano operację" :
                        deleteQuaterErrors[0]}
                    operationPrompt={deleteQuaterStatus}
                />
                }
                
          </div>
        );
    }
}

export default Quaters;