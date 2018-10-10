import React, { Component } from 'react'
import './addQuarter.scss';
import Form from '../../../components/form/form.js';
import { connect } from 'react-redux';
import {
    addQuarterTalkACreator,
    addQuarterTalk,
    getQuarterQuestionsACreator, getQuestions
  } from "../../../actions/quarterTalks.js";
import Spinner from '../../common/spinner/spinner.js';
import LoadHandlingWrapper from '../../../hocs/handleLoadingContent';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import List from '../../common/list/list';
import QuestionToSelect from './questionToSelect/questionToSelect';
import SpinnerButton from '../../form/spinner-btn/spinner-btn.js';
/*  {
                title: "Rok", mode: "date-picker", value: moment(), error: "", canBeNull: false
            },
            {
                title: "Kwartał", mode: "type-and-select", value: "", error: "", canBeNull: false,
                type: "text",
                inputType: "number",
                placeholder: "wybierz lub wpisz kwartał...",
                dataToMap: [
                    {name: "1", id: 1},
                    {name: "2", id: 2},
                    {name: "3", id: 3},
                    {name: "4", id: 4}
                ]
            }*/

const functionsToUseForQuestions = [
    {name: "search", searchBy: "title", count: true}, 
    {name: "sort", sortBy: "title"},
    {name: "filter", filterBy: "isChecked", posibleValues: [{value: false, description: "Niewybrane"}, {value: true, description: "Wybrane"}]}
];

class AddQuarter extends Component{
    state = {
        showSelectQuestionsModal: true,
        addQuarterItems: [],
        isAddingQuarter: false,
        isLoadingQuestions: true,
        itemsDeletedCount: 0
    }
    componentDidMount(){
        const addQuarterItems = [...this.state.addQuarterItems];
        this.props.getQuarterQuestionsACreator().then(response => {
            this.setState({addQuarterItems: this.createQuestionsForm(response), isLoadingQuestions: false})
        }).catch(() => this.setState({isLoadingQuestions: false}));
    }
    componentDidUpdate(prevProps){
        if(prevProps.currentWatchedUser !== this.props.currentWatchedUser && !this.state.showSelectQuestionsModal){
            this.setState({showSelectQuestionsModal: true});
        }
    }
    createQuestionsForm = questions => {
        const copiedQuestions = [...questions];
        const formItems = [];
        const objectToAdd = {
          title: "", mode: "textarea", value: "", error: "", canBeNull: false, maxLength: 300, isChecked: true
        }
        
        for(let i = 0; i < copiedQuestions.length; i++){
          const copiedObject = {...objectToAdd};
          copiedObject.title = copiedQuestions[i].question;
          copiedObject['id'] = copiedQuestions[i].id;
          formItems.push(copiedObject);
        }

        return formItems;
    }

    addQuarter = () => {
        this.setState({isAddingQuarter: true});
        const { addQuarterTalkACreator, match } = this.props;
        const addQuarterItems = [...this.state.addQuarterItems];
        addQuarterTalkACreator(addQuarterItems, match.params.id).then(() => {
            this.setState({isAddingQuarter: false});
        }).catch(() => this.setState({isAddingQuarter: false}));
    }

    togleIsCheckedState = item => {
        const addQuarterItems = [...this.state.addQuarterItems];
        const indexOfItem = addQuarterItems.findIndex(i => i.title === item.title);
        addQuarterItems[indexOfItem].isChecked = !addQuarterItems[indexOfItem].isChecked;
        const newDeletedItemsCount = addQuarterItems.filter(i => i.isChecked === false);
        
        this.setState({addQuarterItems, itemsDeletedCount: newDeletedItemsCount.length});
    }

    componentWillUnmount(){
        const { addQuarterTalkClear, clearQuestionResult } = this.props;
        addQuarterTalkClear(); clearQuestionResult();
    }
    
    closeModal = () => {
        const { itemsDeletedCount } = this.state;
        const { onCloseModal, questions } = this.props;
        this.setState({showSelectQuestionsModal: false}, () => {
            if(itemsDeletedCount === questions.length)
                onCloseModal();
        })
    }

    render(){
        const {history, addQuarterTalkStatus, addQuarterTalkErrors, getQuestionsStatus, getQuestionsErrors, clearQuestionResult, questions } = this.props;
        const { isAddingQuarter, addQuarterItems, isLoadingQuestions, showSelectQuestionsModal, itemsDeletedCount} = this.state;
        return (
            <div className="add-quarter-container">
                <LoadHandlingWrapper errors={getQuestionsErrors} closePrompt={clearQuestionResult}
                operationStatus={getQuestionsStatus}
                isLoading={isLoadingQuestions}>

                    <div className="form-container">
                        <h1>Dodaj rozmowę kwartalną</h1>
                        <Form
                            btnTitle="Dodaj"
                            shouldSubmit={true}
                            onSubmit={this.addQuarter}
                            isLoading={isAddingQuarter}
                            formItems={addQuarterItems}
                            inputContainerClass="column-container"
                            enableButtonAfterTransactionEnd={true}
                            submitResult={{
                                status: addQuarterTalkStatus,
                                content: addQuarterTalkStatus ? "Pomyślnie utworzono rozmowę kwartalną" :
                                    addQuarterTalkErrors[0]
                            }}
                        />
                    </div>

                    <div className="adding-quarter-settings">
                        <h1>Inne pytania</h1>
                    </div>
                    
                    <Modal
                    open={showSelectQuestionsModal}
                    classNames={{ modal: `Modal select-questions-modal`}}
                    contentLabel="Select questions modal"
                    onClose={this.closeModal}
                    >
                        <header>
                            <h3>Wybierz pytania do wypełnienia</h3>
                        </header>

                        <div className="questions-list">
                            <List shouldAnimateList functionsToUse={functionsToUseForQuestions}
                            clickItemFunction={this.togleIsCheckedState} items={addQuarterItems} component={QuestionToSelect} 
                            />
                        </div>

                        <SpinnerButton
                            validationResult={itemsDeletedCount === questions.length ? false : true}
                            onClickHandler={this.onClickHandler}
                            btnTitle="Rozpocznij"
                        />
                    </Modal>
                </LoadHandlingWrapper>     
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
      addQuarterTalkStatus: state.quarterTalks.addQuarterTalkStatus,
      addQuarterTalkErrors: state.quarterTalks.addQuarterTalkErrors,
  
      getQuestionsStatus: state.quarterTalks.getQuestionsStatus,
      getQuestionsErrors: state.quarterTalks.getQuestionsErrors,
      questions: state.quarterTalks.questions
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      addQuarterTalkACreator: (quarterTalkQuestionItems, employeeId) =>
        dispatch(addQuarterTalkACreator(quarterTalkQuestionItems, employeeId)),
      addQuarterTalkClear: () => dispatch(addQuarterTalk(null, [])),
      getQuarterQuestionsACreator: () => dispatch(getQuarterQuestionsACreator()),
      clearQuestionResult: () => dispatch(getQuestions(null, [], []))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddQuarter);
  