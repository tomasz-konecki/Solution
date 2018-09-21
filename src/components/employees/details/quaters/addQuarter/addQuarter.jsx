import React, { Component } from 'react'
import './addQuarter.scss';
import Form from '../../../../form/form.js';
import { connect } from 'react-redux';
import {
    addQuarterTalkACreator,
    addQuarterTalk,
    getQuarterQuestionsACreator, getQuestions
  } from "../../../../../actions/quarterTalks.js";
import Spinner from '../../../../common/spinner/spinner.js';
import LoadHandlingWrapper from '../../../../../hocs/handleLoadingContent';
import moment from 'moment';
class AddQuarter extends Component{
    state = {
        addQuarterItems: [
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
        ],
        isAddingQuarter: false,
        isLoadingQuestions: true
    }
    componentDidMount(){
        const addQuarterItems = [...this.state.addQuarterItems];
        this.props.getQuarterQuestionsACreator().then(response => {
            this.setState({addQuarterItems: this.createQuestionsForm(response).concat(addQuarterItems), 
                isLoadingQuestions: false})
        }).catch(() => this.setState({isLoadingQuestions: false}));
    }
    createQuestionsForm = questions => {
        const copiedQuestions = [...questions];
        const formItems = [];
        const objectToAdd = {
          title: "", mode: "textarea", value: "dsadsad sad asa asdas ", error: "", canBeNull: false, maxLength: 300,
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

    componentWillUnmount(){
        const { addQuarterTalkClear, clearQuestionResult } = this.props;
        addQuarterTalkClear();
        clearQuestionResult();
    }
    render(){
        const {history, addQuarterTalkStatus, addQuarterTalkErrors, getQuestionsStatus, getQuestionsErrors, clearQuestionResult } = this.props;
        const { isAddingQuarter, addQuarterItems, isLoadingQuestions} = this.state;
        return (
            <div className="add-quarter-container">
                <LoadHandlingWrapper errors={getQuestionsErrors} closePrompt={clearQuestionResult}
                operationStatus={getQuestionsStatus}
                isLoading={isLoadingQuestions}>
                    <h1><i className="fa fa-comments"></i>Dodaj rozmowę kwartalną</h1>
                    <div className="form-container">
                        <Form
                            btnTitle="Dodaj"
                            shouldSubmit={true}
                            onSubmit={this.addQuarter}
                            isLoading={isAddingQuarter}
                            formItems={addQuarterItems}
                            enableButtonAfterTransactionEnd={true}
                            submitResult={{
                                status: addQuarterTalkStatus,
                                content: addQuarterTalkStatus ? "Pomyślnie utworzono rozmowę kwartalną" :
                                    addQuarterTalkErrors[0]
                            }}
                        />
                    </div>
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
  