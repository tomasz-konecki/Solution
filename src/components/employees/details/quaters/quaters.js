import React from 'react'
import './quaters.scss';
import Button from '../../../common/button/button';
import ConfirmModal from '../../../common/confimModal/confirmModal';
import Spinner from '../../../common/spinner/spinner';
import SmallSpinner from '../../../common/spinner/small-spinner';
import OperationStatusPrompt from '../../../form/operationStatusPrompt/operationStatusPrompt';
import Modal from 'react-responsive-modal';
import EmptyContent from '../../../common/empty-content/empty-content';
import ActivateCheckbox from '../others/activateCheckbox';
class Quaters extends React.PureComponent{
    state = {
        quarters: null,
        listToShowIndex: null,
        currentPage: 1, 
        watchedRecords: 0,
        showDeleteModal: false,
        deletingQuater: false,
        activatingQuater: false,
        shouldShowDeleted: false,
        currentOpenedItemId: null
    }
    selectQuartersByState = (state, quartersList) => {
        const newQuarters = [];
        for(let i = 0; i < quartersList.length; i++){
            if(quartersList[i].isDeleted === state)
                newQuarters.push(quartersList[i]);
        }
        return newQuarters;
    }

    componentDidMount(){
        const { quarterTalks } = this.props;
        if(quarterTalks){
            const quarters = this.selectQuartersByState(this.state.shouldShowDeleted, 
                quarterTalks);
            this.setState({quarters: quarters});
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.deleteQuaterStatus){
            const quarters = this.selectQuartersByState(this.state.shouldShowDeleted, 
                [...nextProps.quarterTalks]);
            const shouldShowActiveQuarters = quarters.length === 0;
            this.setState({deletingQuater: false, showDeleteModal: false, 
                listToShowIndex: null, quarters: quarters, 
                shouldShowDeleted: shouldShowActiveQuarters,
                currentOpenedItemId: null});
        }
        else if(nextProps.reactivateQuaterStatus){
            const quarters = this.selectQuartersByState(this.state.shouldShowDeleted, 
                [...nextProps.quarterTalks]);
            const shouldShowDeletedQuarters = quarters.length === 0;

            this.setState({quarters: quarters, activatingQuater: false,
                shouldShowDeleted: shouldShowDeletedQuarters, listToShowIndex: null, 
                currentOpenedItemId: null});
        }
        else if(nextProps.deleteQuaterErrors !== this.props.deleteQuaterErrors)
            this.setState({deletingQuater: false});
        else if(nextProps.reactivateQuaterErrors !== this.props.reactivateQuaterErrors)
            this.setState({activatingQuater: false});
    }
    showDetails = (index, itemId) => {
        const { listToShowIndex, currentOpenedItemId } = this.state;
        const newIndex = listToShowIndex === index ? null : index;
        const newItemId = currentOpenedItemId === itemId ? null : itemId;
        this.setState({listToShowIndex: newIndex, currentOpenedItemId: newItemId})
    }
    deleteQuaters = () => {
        this.setState({deletingQuater: true});
        const { deleteQuaterACreator, employeeId} = this.props;
        deleteQuaterACreator(this.state.currentOpenedItemId, employeeId);
    }

    activateQuaters = quarterId => {
        this.setState({activatingQuater: true});
        this.props.reactivateQuaterACreator(quarterId, this.props.employeeId, 
            "Aktywowano rozmowę");
    }
    showDeleted = () => {
        const { shouldShowDeleted } = this.state;
        const quarters = this.selectQuartersByState(!shouldShowDeleted, 
            this.props.quarterTalks);
        this.setState({shouldShowDeleted: !shouldShowDeleted, quarters: quarters,
            currentPage: 1, watchedRecords: 0, currentOpenedItemId: null, listToShowIndex: null});
    }
    render(){
        const { paginationLimit, deleteQuaterStatus, deleteQuaterErrors, quarterTalks, status } = this.props;
        const { listToShowIndex, currentPage, watchedRecords, showDeleteModal, 
            deletingQuater, activatingQuater, shouldShowDeleted, quarters } = this.state;
        const shouldShowAddButton = status === "Aktywny" ? 
            <Button title="Dodaj" mainClass="option-btn normal-btn" /> : null;
        return (
            <div className="quaters-container">
                <ActivateCheckbox 
                    shouldShowDeleted={shouldShowDeleted}
                    showDeleted={this.showDeleted} />
                {quarters && 
                    quarters.length > 0 ?
                    <React.Fragment>
                    
                    <h2>Rozmowy kwartalne <span>({quarters.length})</span> { activatingQuater && <SmallSpinner /> }</h2>
                    <ul>
                        {quarters.map((item, index) => {
                            return ( 
                                (index >= paginationLimit * (currentPage-1) && index < paginationLimit * currentPage) &&   
                                <li className={item.isDeleted === true ? "is-deleted-quater" : "is-activate-quater"}
                                onClick={() => this.showDetails(index, item.id)} key={index}>
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

                    <div className="pagination-options">
                        {listToShowIndex !== null && !shouldShowDeleted && status === "Aktywny" && 
                            <i onClick={() => this.setState({showDeleteModal: true})} className="fa fa-trash"></i>
                        }

                        {listToShowIndex !== null && shouldShowDeleted && status === "Aktywny" && 
                            <i onClick={() => this.activateQuaters(quarters[listToShowIndex].id)} className="fa fa-check"></i>
                        }

                        {watchedRecords !== 0 && quarters.length > watchedRecords &&
                            <i onClick={() => this.setState({currentPage: currentPage-1, watchedRecords: watchedRecords-paginationLimit})} className="fa fa-arrow-left"></i>
                        }

                        {currentPage < Math.ceil(quarters.length / paginationLimit) &&
                            <i onClick={() => this.setState({currentPage: currentPage+1, watchedRecords: watchedRecords+paginationLimit})} className="fa fa-arrow-right"></i>
                        }
                    </div>
                    {shouldShowAddButton}
                    </React.Fragment> :
                    <EmptyContent sizeClass="quaters-size"
                    shouldShowTopIcon={status !== "Nieaktywny"}
                    content={`Brak ${shouldShowDeleted ? "usuniętych rozmów" : "aktywnych rozmów"} kwartalnych`}
                    operationIcon="fa fa-plus"
                    mainIcon="fa fa-comments"
                    />
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