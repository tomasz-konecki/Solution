import React, { Component } from 'react'
import './ProjectDetails.scss';
import WebApi from '../../../api/index';
import Aux from '../../../services/auxilary';
import ProjectInformationsCart from './ProjectInformationsCart/ProjectInformationsCart';
import { cutNotNeededKeysFromArray, populateFormArrayWithValues } from '../../../services/methods';
import Spinner from '../../common/spinner/spinner';
import Modal from 'react-responsive-modal';
import Table from '../../common/table/table';
import ProjectDetailsBlock from '../modals/ProjectDetailsBlock';
import AddEmployeeToProject from '../../employees/modals/AddEmployeeToProject';
import AssignmentModal from '../../assign/AssignmentModal';
import OperationLoader from '../../common/operationLoader/operationLoader';
import moment from 'moment';
import Form from '../../form/form';
import ProgressPicker from '../../common/progressPicker/progressPicker';
import { validateInput } from '../../../services/validation';
import SpinnerButton from '../../form/spinner-btn/spinner-btn';
import { errorCatcher } from '../../../services/errorsHandler';
import OperationStatusPrompt from '../../form/operationStatusPrompt/operationStatusPrompt';
import { connect } from 'react-redux';
import { getProjectACreator, addEmployeeToProjectACreator, deleteProjectOwnerACreator, 
    deleteProjectACreator, closeProjectACreator, reactivateProjectACreator, 
    addEmployeeToProject, changeProjectSkillACreator } from '../../../actions/projectsActions';
import Skills from '../../common/skills/skills';
const workerNames = ["Nazwa", "Rola", "Doświadczenie", "Stanowisko", "Data rozpoczęcia", "Data zakończenia"];
const projectStatuses = [{classVal: "spn-active", name:  "Aktywny"}, 
{classVal: "spn-unactive", name:  "Nierozpoczęty"}, {classVal: "spn-unactive", name:  "Usunięty"}];

class ProjectDetails extends Component{
    state = {
        currentOperationError: "",
        isLoadingProject: true,
        editModal: false,
        deleteProjectModal: false,
        addEmployeModal: false,
        operationLoader: false,
        operationError: "",
        addEmployeToProjectFormItems: [
            {title: "Data rozpoczęcia pracy", name: "startDate", type: "text", placeholder: "wprowadź datę rozpoczęcia pracy...", mode: "date-picker", value: "", error: "", canBeBefore: true},
            {title: "Data zakończenia pracy", name: "endDate", type: "text", placeholder: "wprowadź datę zakończenia pracy...", mode: "date-picker", value: "", error: "", canBeBefore: false},
            {title: "Zakres obowiązków", type: "text", placeholder: "dodaj obowiązek..", mode: "input-with-add-items", value: [], typedListVal: "", error: "", inputType: "client", minLength: 3, maxLength: 100, canBeNull: false},
            {title: "Pracownik", type: "text", placeholder: "znajdź pracownika...", mode: "type-ahead", value: "", error: "", inputType: "client", minLength: 3, maxLength: 100, canBeNull: false},
            {title: "Rola w projekcie", canBeNull: true, type: "text", placeholder: "wprowadź role w projekcie...", mode: "select", value: "Developer",
                selectValues: ['Developer', 'Tradesman', 'Human Resources', 'Team Leader', 'Administrator', 'Manager'
            ]}
        ],
        lteVal: 1,
        addEmployeSpinner: false,
    }
    componentDidMount(){
        this.props.getProject(this.props.match.params.id);
    }  
    fillDates = (startDate, endDate, estimatedEndDate) => {
        const addEmployeToProjectFormItems = [...this.state.addEmployeToProjectFormItems];
        addEmployeToProjectFormItems[0].value = moment(startDate);
        addEmployeToProjectFormItems[1].value = moment(endDate ? 
            endDate : estimatedEndDate);
        return addEmployeToProjectFormItems;
    }
    componentWillReceiveProps(nextProps){
        
        if(this.props.project === null){ 
            this.setState({addEmployeToProjectFormItems: this.fillDates(nextProps.project.startDate, 
            nextProps.project.endDate, nextProps.project.estimatedEndDate), isLoadingProject: false});
        }
        else{
            let isError = null;
            if(Array.isArray(nextProps[this.state.currentOperationError]))
                isError = nextProps[this.state.currentOperationError].length > 0 ? true : false;

            if(isError === true){
                this.setState({
                    operationLoader: false,
                    operationError: (!nextProps[this.state.currentOperationError] || isError === false) ? "" : 
                    nextProps[this.state.currentOperationError], 
                    deleteProjectModal: false,
                    addEmployeSpinner: false
                });
            }
            else{
                if(nextProps.loadProjectErrors !== this.props.loadProjectErrors){
                    const addEmployeToProjectFormItems = this.fillDates(nextProps.project.startDate, 
                        nextProps.project.endDate, nextProps.project.estimatedEndDate);
                    
                    this.setState({
                        operationLoader: false,
                        currentOperationError: "",
                        operationError: "",
                        addEmployeToProjectFormItems: addEmployeToProjectFormItems,
                        isLoadingProject: false

                    })
                }
                else if(nextProps.addEmployeeToProjectErrors !== this.props.addEmployeeToProjectErrors)
                    this.setState({addEmployeSpinner: false});
            }
        }
     
        
    }
    createLTEPicker = range => {
        const spansArray = [];
        for(let i = 1; i <= range; i++){
            spansArray.push(<span style={{backgroundColor: i <= this.state.lteVal ? 'lightseagreen' : null}} 
                key={i}
                onClick={() => this.setState({lteVal: i})}>
                {i === this.state.lteVal ? <i>{this.state.lteVal/range * 100}%</i> : null}
            </span>);
        }
        return spansArray;
    }

    addEmployeeToProject = () => {
        this.setState({addEmployeSpinner: true});
        this.props.addEmployeeToProject(this.state.addEmployeToProjectFormItems[3].value, 
            this.props.project.id, this.state.addEmployeToProjectFormItems[0].value, 
            this.state.addEmployeToProjectFormItems[1].value, this.state.addEmployeToProjectFormItems[4].value, 
            this.state.lteVal, this.state.addEmployeToProjectFormItems[2].value);
    }
    deleteProjectOwner = index => {
        this.setState({operationLoader: true, 
            currentOperationError: "delProjectOwnerErrors"});
        this.props.deleteProjectOwner(this.props.project.id, this.props.project.owners[index].id);
    }
    deleteProject = () => {
        this.setState({operationLoader: true, operationError: "", 
            currentOperationError: "deleteProjectErrors"});
        this.props.deleteProject(this.props.project.id);
    }
    closeProject = () => {
        this.setState({operationLoader: true, operationError: "", 
            currentOperationError: "closeProjectErrors"});
        this.props.closeProject(this.props.project.id);
    }

    reactivateProject = () => {
        this.setState({operationLoader: true, operationError: "", 
            currentOperationError: "reactivateProjectErrors"});
        this.props.reactivateProject(this.props.project.id);
    }
    changeSkills = (skillId, skillLevel) => {
        this.props.changeProjectSkill(this.props.project.id, skillId, skillLevel);
    }
    render(){
        return(
            <div onClick={this.props.addEmployeeToProjectStatus !== null ? 
                () => this.props.addEmployeeToProjectAction(null, []) : null} className="project-details-container">
                {this.state.isLoadingProject ? 
                <Spinner /> :
                this.props.project && 
                <Aux>
                    <header>
                        <h1>
                            <i className="fa fa-briefcase fa-2x"></i>
                            <b>{this.props.project.name}
                                <span className={projectStatuses[this.props.project.status].classVal}>
                                {projectStatuses[this.props.project.status].name}
                                </span>
                            </b>
                        </h1>
                        <nav>
                            <button onClick={() => this.setState({editModal: !this.state.editModal})} 
                                className="option-btn normal-btn">Edytuj projekt</button>


                            {this.props.project.status !== 0 && 
                                <button onClick={this.reactivateProject} className="option-btn green-btn">Aktywuj projekt</button>
                            }

                            {(this.props.project.status !== 1 && this.props.project.status !== 1)  && 
                                <button onClick={this.closeProject} className="option-btn option-dang">Wstrzymaj</button>
                            }

                            {(this.props.project.status !== 2 && this.props.project.status !== 1) &&
                                <button onClick={() => this.setState({deleteProjectModal: !this.state.deleteProjectModal})} className="option-btn option-very-dang">Usuń projekt</button>
                            }
                        </nav>
                    </header>
                    <main>
                        <div className="project-details">
                            <ProjectInformationsCart key={1} 
                            items={this.props.overViewKeys}
                            headerTitle="Informacje ogólne"
                            originalObject={this.props.project}
                            dateKeys={["startDate","estimatedEndDate", "endDate"]}
                            />

                            <ProjectInformationsCart key={2} 
                            items={this.props.responsiblePersonKeys} 
                            headerTitle="Osoba odpowiedzialna" 
                            originalObject={this.props.project.responsiblePerson}
                            />
                            <article>
                                <h4>Opis</h4>
                                {this.props.project.description}
                            </article>
                            <h4>Właściciele</h4>
                            <div className="owners-list">
                                {this.props.project.owners.map((i, index) => {
                                    return (
                                    <button key={i.id} className="owner-btn">
                                        {i.fullName}
                                        <i onClick={() => this.deleteProjectOwner(index)}>Usuń</i>
                                    </button>);
                                })}
                            </div>
                        </div>

                        <div className="right-project-spec">
                            <Table 
                                projectId={this.props.project.id}
                                items={this.props.project.team} 
                                title="Zespół projektowy"
                                thds={workerNames}
                                emptyMsg="Ten projekt nie ma jeszcze pracowników"
                                togleAddEmployeeModal={() => this.setState({addEmployeModal: !this.state.addEmployeModal})}
                                />
                                
                            {this.props.project.skills.length > 0 &&
                                <Skills 
                                status={this.props.changeProjectSkillStatus}
                                errors={this.props.changeProjectSkillErrors}
                                finalFunction={this.changeSkills}
                                title="Umiejętności na potrzeby projektu"
                                items={this.props.project.skills} />
                            }       
                        </div>
                    </main>

                <Modal
                    key={1}
                    open={this.state.editModal}
                    classNames={{ modal: "Modal Modal-add-owner" }}
                    contentLabel="Edit project modal"
                    onClose={() => this.setState({editModal: !this.state.editModal})}>
                    
                    <ProjectDetailsBlock
                    project={this.props.project}
                    additionalOperation={this.props.getProject}
                    />
                </Modal>
                <Modal
                key={2}
                open={this.state.deleteProjectModal}
                classNames={{ modal: "Modal Modal-add-owner" }}
                contentLabel="Delete project"
                onClose={() => this.setState({deleteProjectModal: !this.state.deleteProjectModal})}
                >
                    <div className="delete-content-modal">
                        <h2>Czy jesteś pewny, że chcesz usunać projekt?</h2>
                        <div>
                            <button className="option-btn green-btn" onClick={this.deleteProject}>Usuń</button>
                            <button className="option-btn" 
                            onClick={() => this.setState({deleteProjectModal: !this.state.deleteProjectModal})}>Anuluj</button>
                        </div>
                        
                    </div>
                    
                </Modal>


                <Modal 
                key={3}
                open={this.state.addEmployeModal}
                classNames={{ modal: "Modal Modal-add-owner" }}
                contentLabel="Add employee to project modal"
                onClose={() => this.setState({addEmployeModal: !this.state.addEmployeModal})}>
                    <header>
                        <h3 className="section-heading">Dodaj pracownika do projektu <b>{this.props.project.name}</b></h3>
                    </header>
                    <Form 
                        btnTitle="Dodaj"
                        key={4}
                        endDate={this.props.estimatedEndDate}
                        shouldSubmit={false}
                        dateIndexesToCompare={[0,1]}
                        onSubmit={this.addEmployeeToProject}
                        isLoading={this.state.addEmployeSpinner}
                        formItems={this.state.addEmployeToProjectFormItems} 
                        shouldCancelInputList={true}
                        >
                        <div className="lte-pic-container">
                            <label>Długość etatu</label>
                            <ProgressPicker 
                            settings={{width: '10%'}}
                            createResult={this.createLTEPicker(10)} />
                        </div>
                    </Form>
                </Modal>

                {(this.state.operationLoader || this.state.operationError !== "") && 
                    <OperationLoader 
                    isLoading={this.state.operationLoader}
                    operationError={this.state.operationError}
                    close={() => this.setState({operationLoader: false, operationError: ""})}
                />
                }

                {(this.props.addEmployeeToProjectStatus !== null && 
                this.props.addEmployeeToProjectStatus !== undefined) &&
                    <OperationStatusPrompt 
                    operationPromptContent={this.props.addEmployeeToProjectStatus ? 
                        "Pomyślnie dodano pracownika do projektu" : 
                        this.props.addEmployeeToProjectErrors && 
                        this.props.addEmployeeToProjectErrors[0]} 
                    operationPrompt={this.props.addEmployeeToProjectStatus} />
                }
                </Aux>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        project: state.projectsReducer.project,
        loadProjectStatus: state.projectsReducer.loadProjectStatus,
        loadProjectErrors: state.projectsReducer.loadProjectErrors,
        responsiblePersonKeys: state.projectsReducer.responsiblePersonKeys,
        overViewKeys: state.projectsReducer.overViewKeys,

        addEmployeeToProjectStatus: state.projectsReducer.addEmployeeToProjectStatus,
        addEmployeeToProjectErrors: state.projectsReducer.addEmployeeToProjectErrors,

        delProjectOwnerStatus: state.projectsReducer.delProjectOwnerStatus,
        delProjectOwnerErrors: state.projectsReducer.delProjectOwnerErrors,

        deleteProjectStatus: state.projectsReducer.deleteProjectStatus,
        deleteProjectErrors: state.projectsReducer.deleteProjectErrors,

        closeProjectStatus: state.projectsReducer.closeProjectStatus,
        closeProjectErrors: state.projectsReducer.closeProjectErrors,

        reactivateProjectStatus: state.projectsReducer.reactivateProjectStatus,
        reactivateProjectErrors: state.projectsReducer.reactivateProjectErrors,

        changeProjectSkillStatus: state.projectsReducer.changeProjectSkillStatus,
        changeProjectSkillErrors: state.projectsReducer.changeProjectSkillErrors
    };
  }
  
const mapDispatchToProps = dispatch => {
    return {
        getProject: (projectId) => dispatch(getProjectACreator(projectId)),
        addEmployeeToProject: (empId, projId, strDate, endDate, 
            role, assignedCapacity, responsibilites) => dispatch(addEmployeeToProjectACreator(empId, projId, strDate, endDate, 
                role, assignedCapacity, responsibilites)),
        addEmployeeToProjectAction: (status, errors) => dispatch(addEmployeeToProject(status, errors)),
        deleteProjectOwner: (projectId, ownerId) => dispatch(deleteProjectOwnerACreator(projectId, ownerId)),
        deleteProject: (projectId) => dispatch(deleteProjectACreator(projectId)),
        closeProject: (projectId) => dispatch(closeProjectACreator(projectId)),
        reactivateProject: (projectId) => dispatch(reactivateProjectACreator(projectId)),
        changeProjectSkill: (projectId, skillId, skillLevel) => dispatch(changeProjectSkillACreator(projectId, skillId, skillLevel))
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
  