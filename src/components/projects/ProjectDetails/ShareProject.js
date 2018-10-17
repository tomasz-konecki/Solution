import React, { Component } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import { translate } from 'react-translate'

import WebApi from "../../../api/index";
import SpinnerButton from '../../../components/form/spinner-btn/spinner-btn'

class ShareProject extends Component {
    
    state = {
        managers: [],
        selectedManagers: [],    
        currentSelectedManager: [],
        isLoading: false,
        sharedFinished: false,
        changed: false,
        errors: [],
        message: ''
    }

    componentDidMount(){
        this.getManagers()
        this.getAlreadyShareManagers();
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

    getManagers = () => {
        this.setState({ isLoading: true });            
    
        WebApi.shareProject.get
          .managers(this.props.projectId)
          .then(response => {
            
            const managers = [{id:"0", fullName: ""}, ...response.replyBlock.data.dtoObjects];
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

    getAlreadyShareManagers = () => {
        this.setState({ isLoading: true });            
    
        WebApi.shareProject.get
          .alreadySharedManagers(this.props.projectId)
          .then(response => {
            
            const selectedManagers = [...response.replyBlock.data.dtoObjects];
            this.setState({
              selectedManagers,
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
            destinationManagersIds: this.state.selectedManagers.map(m => (m.id)),
        })
        .then(response => {
            this.setState({
                isLoading: false,
                sharedFinished: true,
                selectedManagers: [],
                currentSelectedManager: [],
                changed: false,
                message: this.props.t("ChangesSaved"),
            });
            this.getAlreadyShareManagers();
            
        })
        .catch(err =>{            
            this.setState({
                isLoading: false,                
                errors: this.concatErrors(err.replyBlock.data.errorObjects),
                message: ''
            });
        })
    }

    onSelect = e =>{
        if(e.length === 0 || e[0].id == "0"){
            return
        }
        const selectedManagers = this.state.selectedManagers;
        selectedManagers.push(e[0])

        const managers = this.state.managers.filter((value, index, arr) => {            
            return e[0] && value.id !== e[0].id;
        });
        
        const currentSelectedManager = [];
        currentSelectedManager.push(managers[0])
        this.setState({
            errors: [],
            currentSelectedManager,
            selectedManagers,
            managers,
            changed: true,
            message: '',
        })
    } 

    onDelete = id =>{       
        const managers = this.state.managers;
        const managerToDelete = this.state.selectedManagers.filter((value, index, arr) => {            
            return value.id === id;
        }) [0];
        managers.push(managerToDelete)
        const selectedManagers = this.state.selectedManagers.filter((value, index, arr) => {            
            return value.id !== id;
        });
        
        const currentSelectedManager = [];
        currentSelectedManager.push(managers[0])
        this.setState({
            errors: [],
            currentSelectedManager,
            selectedManagers,
            managers,
            changed: true,
            message: '',
        })
    } 


    render(){    
      const {t} = this.props
        return(                  
            <form onSubmit={e => this.onSubmit(e)} >        
                <div className="row justify-content-center">                    
                    <div className="col col-sm-8">  
                        <h2 className="mb-5 text-center">{t('ShareProject')}</h2>
                        <div className="row">                        
                            <label className="mt-1 mr-2">{t('SelectPersons')}</label>      
                            <div style={{width: '68%'}}>
                                <Typeahead
                                    disabled={this.state.isLoading}
                                    emptyLabel={true ? t('NotFound') : undefined}
                                    labelKey={option => `${option.fullName}`}
                                    onChange={employee => {this.onSelect(employee)}}
                                    ref={typeahead => (this.typeahead = typeahead)}
                                    selectHintOnEnter={false}
                                    highlightOnlyResult
                                    options={this.state.managers}
                                    placeholder=""
                                    selected={this.state.currentSelectedManager}
                                />                                           
                            </div>                                  
                        </div>                     
                    </div>
                </div>
                <div className="row justify-content-center mx-2">
                
                <div className="col col-sm-5 mt-5 border" style={{height: '150px', overflowY: 'scroll'}}>                
                <label>{t('Shared')}:</label>
                {
                    this.state.selectedManagers.map(manager=>{
                    return(                        
                        <div key={manager.id} className="row justify-content-end my-2 mr-2">
                            <div style={{cursor: 'default'}}>{manager.fullName}</div>
                            <div className="d-block text-danger mx-2 my-auto" style={{cursor: 'pointer'}} onClick={()=> this.onDelete(manager.id)} >X</div>
                        </div>
                    )
                })
                }
                </div>
                </div>


                  {
                    this.state.errors.map(err=>{
                    return(
                        <p key={err} className="form-error">{err}</p>
                    )
                  })
                }
                <p className="form-error" style={{ color: "green" }}>{this.state.message}</p>
            <SpinnerButton
                validationResult={this.state.selectedManagers != [] && this.state.changed}
                transactionEnd={this.state.sharedFinished}
                onClickHandler={this.shareProject}
                isLoading={this.state.isLoading}
                btnTitle={t('Confirm')}
                enableButtonAfterTransactionEnd={true}
                />
          </form>
        )
    }    
}

export default translate('ShareProject')(ShareProject);