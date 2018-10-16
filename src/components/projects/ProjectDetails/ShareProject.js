import React, { Component } from "react";
import Form from "../../form/form";
import WebApi from "../../../api/index";
import SpinnerButton from '../../../components/form/spinner-btn/spinner-btn'

class ShareProject extends Component {
    
    state = {
        managers: [],
        selectedManagerId: "",    
        isLoading: false,
        sharedFinished: false,
        errors: []
    }

    componentDidMount(){
        this.searchOnServer()
    }

    concatErrors(errs){
        let result =[];
        errs.forEach(obj=>{
            for (var key in obj['errors']){
                result.push(obj['errors'][key])
            }
        })
        return result;
    }

    searchOnServer = () => {
        this.setState({ isLoading: true });            
    
        WebApi.shareProject.get
          .managers(this.props.projectId)
          .then(response => {
            
            const managers = [{id:"", fullName: ""}, ...response.replyBlock.data.dtoObjects];
            this.setState({
              managers,
              isLoading: false,
                })
            })
          .catch(err => {
            this.setState({
                isLoading: false,                
                errors: this.concatErrors(err.replyBlock.data.errorObjects)
            });
          })
    }


    shareProject = () =>{
        this.setState({isLoading: true});

        WebApi.shareProject.post.add(this.props.projectId, {
            projectId: this.props.projectId,
            destinationManagerId: this.state.selectedManagerId,
        })
        .then(response => {
            this.setState({
                isLoading: false,
                sharedFinished: true,
                selectedManagerId: ''
            });
        })
        .catch(err =>{
            
            this.setState({
                isLoading: false,                
                errors: this.concatErrors(err.replyBlock.data.errorObjects)
            });
        })
    }

    onSelect = e =>{
        this.setState({
            errors: [],
            selectedManagerId: e.target.value
        })
    } 

    render(){    

        return(        
            <form onSubmit={e => this.onSubmit(e)} className="universal-form-container" >
             <section className={`input-container `}>
              <label>Wybierz komu</label>
              <div className="right-form-container">
                <select  className="simple-select" onChange={e => this.onSelect(e)}
                    value={this.state.selectedManagerId}>
                    {this.state.managers.map(m => {
                        return (
                        <option key={m.id} value={m.id}> {m.fullName} </option>
                        );
                    })}
                </select>          
              </div>
              </section>                            
                  {
                    this.state.errors.map(err=>{
                    return(
                        <p key={err} className="form-error">{err}</p>
                    )
                  })
                }
            <SpinnerButton
                validationResult={this.state.selectedManagerId != ""}
                transactionEnd={this.state.sharedFinished}
                onClickHandler={this.shareProject}
                isLoading={this.state.isLoading}
                btnTitle="Udostępnij"
                enableButtonAfterTransactionEnd={true}
                />
          </form>
        )
    }    
}

export default ShareProject;