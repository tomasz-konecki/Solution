import React, { Component } from 'react'
import './addQuarter.scss';
import Form from '../../../components/form/form.js';
import { connect } from 'react-redux';
import {deleteQuestion,
    deleteQuestionACreator,
    addQuestionACreator,
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
import Button from '../../common/button/button.js';
import { validateInput } from '../../../services/validation.js';
import SmallSpinner from '../../common/spinner/small-spinner.js';
const additionalFormItems = [
    {
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
    }
];          

const functionsToUseForQuestions = [
    {name: "search", searchBy: "question", count: true}, 
    {name: "sort", sortBy: "question"},
    {name: "filter", filterBy: "isChecked", posibleValues: [{value: false, description: "Niewybrane"}, {value: true, description: "Wybrane"}]}
];

class AddQuarter extends Component{
    state = {
        showSelectQuestionsModal: true,
        addQuarterQuestions: [],
        addQuarterFormItems: [],
        isAddingQuarter: false,
        isLoadingQuestions: true,
        itemsDeletedCount: 0,
        newQuestionName: {value: "", error: ""},
        isAddingNewQuestion: false, isPostingNewQuestion: false, shouldPutAddedQuestionInForm: false,
        isDeletingQuestion: false
    }
    componentDidMount(){
        this.getQuestions();
    }
    getQuestions = () => {
        this.props.getQuarterQuestionsACreator().then(response => {
            this.setState({addQuarterQuestions: this.createStartFormData(response), 
                isLoadingQuestions: false, itemsDeletedCount: response.length})
        }).catch(() => this.setState({isLoadingQuestions: false}));
    }

    componentDidUpdate(prevProps){
        if(prevProps.currentWatchedUser !== this.props.currentWatchedUser && !this.state.showSelectQuestionsModal){
            this.setState({showSelectQuestionsModal: true});
        }
        if(this.state.shouldPutAddedQuestionInForm)
            this.setState({shouldPutAddedQuestionInForm: false});
    }
    createFormItem = (id, title) => {
        return { id, title, mode: "textarea", value: "", error: "", canBeNull: false, maxLength: 300 };
    }

    createFormItems = () => {
        const { addQuarterQuestions } = this.state;
        const onlyCheckedQuarterQuestions = addQuarterQuestions.filter(i => i.isChecked);
        let addQuarterFormItems = onlyCheckedQuarterQuestions.map(i => {
            return this.createFormItem(i.id, i.question);
        })
        addQuarterFormItems = addQuarterFormItems.concat(additionalFormItems);
        this.setState({addQuarterFormItems, showSelectQuestionsModal: false});
    }
    createQuestion = (id, question, isChecked) => {
        return { id, question, isChecked };
    }
    createStartFormData = questions => {
        const addQuarterQuestions = questions.map(i => this.createQuestion(i.id, i.question, true));
        return addQuarterQuestions;
    }

    addQuarter = () => {
        this.setState({isAddingQuarter: true});
        const { addQuarterTalkACreator, match } = this.props;
        const addQuarterQuestions = [...this.state.addQuarterQuestions];
        addQuarterTalkACreator(addQuarterQuestions, match.params.id).then(() => {
            this.setState({isAddingQuarter: false});
        }).catch(() => this.setState({isAddingQuarter: false}));
    }

    togleIsCheckedState = item => {
        const addQuarterQuestions = [...this.state.addQuarterQuestions];
        const addQuarterFormItems = [...this.state.addQuarterFormItems];
        const indexOfItem = addQuarterQuestions.findIndex(i => i.id === item.id);
        addQuarterQuestions[indexOfItem].isChecked = !addQuarterQuestions[indexOfItem].isChecked;
        const itemsDeletedCount = addQuarterQuestions.filter(i => i.isChecked).length;

        this.setState({addQuarterQuestions, addQuarterFormItems, itemsDeletedCount});
    }

    componentWillUnmount(){
        const { addQuarterTalkClear, clearQuestionResult } = this.props;
        addQuarterTalkClear(); clearQuestionResult();
    }
    
    closeModal = () => {
        const { itemsDeletedCount } = this.state;
        const { onCloseModal, deleteQuestionClearData, deleteQuestionStatus } = this.props;
        this.setState({showSelectQuestionsModal: false}, () => {
            if(deleteQuestionStatus !== null)
                deleteQuestionClearData();
            
            if(itemsDeletedCount === 0)
                onCloseModal();
            else
                this.createFormItems();
        })
    }

    openSelectQuestionsModal = () => {
        this.setState({addQuarterFormItems: [], showSelectQuestionsModal: true}, () => this.getQuestions());
    }

    onChangeNewQuestion = e => {
        const newQuestionName = {...this.state.newQuestionName};
        newQuestionName.value = e.target.value;
        newQuestionName.error = validateInput(newQuestionName.value, false, 3, 120);
        this.setState({newQuestionName});
    }

    deleteQuestion = questionId => {
        const { deleteQuestionACreator } = this.props;
        this.setState({isDeletingQuestion: true});
        deleteQuestionACreator(questionId).then(() => {
            const addQuarterQuestions = [...this.state.addQuarterQuestions];
            const index = addQuarterQuestions.findIndex(i => i.id === questionId);
            addQuarterQuestions.splice(index, 1);
            this.setState({isDeletingQuestion: false, addQuarterQuestions});
        }).catch(() => this.setState({isDeletingQuestion: false}));
    }

    chooseFunction = (item, functionName) => {
        switch(functionName){
            case "delete":
                this.deleteQuestion(item.id);
            break;
            default:
                this.togleIsCheckedState(item);
            break;
        }
    }

    addQuestion = () => {
        const newQuestionName = {...this.state.newQuestionName};
        let addQuarterFormItems = [...this.state.addQuarterFormItems];
        newQuestionName.error = validateInput(newQuestionName.value, false, 3, 120);
        if(!newQuestionName.error){
            // dodaj element na strone
            this.setState({isPostingNewQuestion: true});
            this.props.addQuestionACreator(newQuestionName.value)
            .then(questionId => {
                addQuarterFormItems = additionalFormItems.unshift(this.createFormItem(questionId, newQuestionName.value));
                newQuestionName.value = "";
                this.setState({isPostingNewQuestion: false, shouldPutAddedQuestionInForm: true, addQuarterFormItems, newQuestionName});
            }).catch(() => this.setState({isPostingNewQuestion: false}));
        }
        else
            this.setState({newQuestionName});
    }


    componentWillUnmount(){
        this.props.deleteQuestionClearData();
    }
    render(){
        const {history, addQuarterTalkStatus, addQuarterTalkErrors, getQuestionsStatus, getQuestionsErrors, clearQuestionResult,
            addQuestionErrors, deleteQuestionStatus, deleteQuestionErrors } = this.props;
        const { isDeletingQuestion, isAddingQuarter, addQuarterQuestions, isLoadingQuestions, showSelectQuestionsModal, shouldPutAddedQuestionInForm, 
            itemsDeletedCount, addQuarterFormItems, newQuestionName, isAddingNewQuestion, isPostingNewQuestion } = this.state;
        return (
            <div className="add-quarter-container">
                <LoadHandlingWrapper errors={getQuestionsErrors} closePrompt={clearQuestionResult}
                operationStatus={getQuestionsStatus}
                isLoading={isLoadingQuestions}>
                {addQuarterFormItems.length > 0 && 
                  <React.Fragment>
                    <div className="form-container">
                        <h1>Dodaj rozmowę kwartalną</h1>
                        <Form
                            btnTitle="Dodaj"
                            newFormItems={addQuarterFormItems}
                            shouldChangeFormState={shouldPutAddedQuestionInForm}
                            shouldSubmit={true}
                            onSubmit={this.addQuarter}
                            isLoading={isAddingQuarter}
                            formItems={addQuarterFormItems}
                            inputContainerClass="column-container"
                            placeToUsePropsChildren="top"
                            enableButtonAfterTransactionEnd={true}
                            submitResult={{
                                status: addQuarterTalkStatus,
                                content: addQuarterTalkStatus ? "Pomyślnie utworzono rozmowę kwartalną" :
                                    addQuarterTalkErrors[0]
                            }}
                        >
                            {isAddingNewQuestion && 
                            <section className="input-container column-container">
                                <label>
                                    {newQuestionName.value ? newQuestionName.value : "Tu pojawi się pytanie"}
                                </label>
                                <div className="right-form-container">
                                    <div>
                                        {isPostingNewQuestion && <SmallSpinner />}
                                        <textarea className={newQuestionName.error !== "" ? "input-error" : ""}
                                        onChange={e => this.onChangeNewQuestion(e)} value={newQuestionName.value} 
                                            type="text" placeholder="dodaj nowe pytanie..."></textarea>
                                        {isPostingNewQuestion || 
                                            <i onClick={this.addQuestion}
                                            className={`fa fa-plus ${newQuestionName.error !== "" ? "unactive-plus" : "active-plus"}`}></i>
                                        }
                                    </div>
                                    <p className="form-error">
                                        <span>{addQuestionErrors ? addQuestionErrors : newQuestionName.error}</span>
                                    </p>
                                </div>
                            </section>
                            }
                        </Form>
                        
                    </div>

                    <div className="adding-quarter-settings">
                        <h1>Opcje</h1>
                        <Button onClick={() => this.setState({isAddingNewQuestion: !isAddingNewQuestion})} title="Dodaj pytanie" 
                        mainClass="generate-raport-btn btn-green"><i className="fa fa-plus"/></Button>

                        <Button onClick={this.openSelectQuestionsModal} title="Zarządzaj pytaniami" 
                        mainClass="generate-raport-btn btn-green"><i className="fa fa-question-circle"/></Button>

                        
                
                    </div>
                  </React.Fragment>
                }
                   
                    
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
                            clickItemFunction={this.chooseFunction} items={addQuarterQuestions} component={QuestionToSelect} 
                            />
                        </div>

                        <SpinnerButton
                            validationResult={itemsDeletedCount === 0 ? false : true}
                            onClickHandler={this.createFormItems}
                            btnTitle="Rozpocznij"
                            isLoading={isDeletingQuestion}
                            submitResult={{
                                status: deleteQuestionStatus,
                                content: deleteQuestionStatus ? "Pomyślnie usunięto pytanie" :
                                    deleteQuestionErrors[0]        
                            }}
                            
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
      questions: state.quarterTalks.questions,

      addQuestionStatus: state.quarterTalks.addQuestionStatus, 
      addQuestionErrors: state.quarterTalks.addQuestionErrors,

      deleteQuestionStatus: state.quarterTalks.deleteQuestionStatus,
      deleteQuestionErrors: state.quarterTalks.deleteQuestionErrors
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      addQuarterTalkACreator: (quarterTalkQuestionItems, employeeId) =>
        dispatch(addQuarterTalkACreator(quarterTalkQuestionItems, employeeId)),
      addQuarterTalkClear: () => dispatch(addQuarterTalk(null, [])),
      getQuarterQuestionsACreator: () => dispatch(getQuarterQuestionsACreator()),
      clearQuestionResult: () => dispatch(getQuestions(null, [], [])),

      addQuestionACreator: (question) => dispatch(addQuestionACreator(question)),
      deleteQuestionACreator: questionId => dispatch(deleteQuestionACreator(questionId)),
      deleteQuestionClearData: () => dispatch(deleteQuestion(null, []))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddQuarter);
  