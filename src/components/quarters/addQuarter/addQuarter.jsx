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
import Button from '../../common/button/button.js';

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
        itemsDeletedCount: 0
    }
    componentDidMount(){
        this.props.getQuarterQuestionsACreator().then(response => {
            this.setState({addQuarterQuestions: this.createStartFormData(response), isLoadingQuestions: false, itemsDeletedCount: response.length})
        }).catch(() => this.setState({isLoadingQuestions: false}));
    }
    componentDidUpdate(prevProps){
        if(prevProps.currentWatchedUser !== this.props.currentWatchedUser && !this.state.showSelectQuestionsModal){
            this.setState({showSelectQuestionsModal: true});
        }
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
        const { onCloseModal } = this.props;
        this.setState({showSelectQuestionsModal: false}, () => {
            if(itemsDeletedCount === 0)
                onCloseModal();
            else
                this.createFormItems();
        })
    }

    openSelectQuestionsModal = () => {
        this.setState({addQuarterFormItems: [], showSelectQuestionsModal: true});
    }

    render(){
        const {history, addQuarterTalkStatus, addQuarterTalkErrors, getQuestionsStatus, getQuestionsErrors, clearQuestionResult } = this.props;
        const { isAddingQuarter, addQuarterQuestions, isLoadingQuestions, showSelectQuestionsModal, itemsDeletedCount, addQuarterFormItems} = this.state;
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
                            shouldSubmit={true}
                            onSubmit={this.addQuarter}
                            isLoading={isAddingQuarter}
                            formItems={addQuarterFormItems}
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
                        <Button onClick={this.openSelectQuestionsModal} title="Zmień pytania" 
                        mainClass="generate-raport-btn btn-green"><i className="fa fa-users"/></Button>
                
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
                            clickItemFunction={this.togleIsCheckedState} items={addQuarterQuestions} component={QuestionToSelect} 
                            />
                        </div>

                        <SpinnerButton
                            validationResult={itemsDeletedCount === 0 ? false : true}
                            onClickHandler={this.createFormItems}
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
  