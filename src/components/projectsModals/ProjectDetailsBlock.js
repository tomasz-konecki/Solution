import React, { Component } from "react";
import Detail from "../common/Detail";
import ResultBlock from "./../common/ResultBlock";
import "../../scss/components/projectsModals/ProjectDetailsBlock.scss";
const emptyField = "<brak>";
const active = "Aktywny";
const inActive = "Nieaktywny";

class ProjectDetailsBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = event => {
    const field = event.target.name;
    let project = this.props.project;
    project[field] = event.target.value;
    project.createdBy = "tkonecki";
    this.setState({
      project
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.table(this.state.project);
    this.props.editProject(this.state.project);
  };

  componentDidMount() {
    console.log("ProjectDSetailsBlock props = ", this.props);
  }

  render() {
    return (
      <div className="project-details-block">
        <header>
          <h3>Edycja danych projektu</h3>
        </header>
        <div className="project-details-container">
          <form onSubmit={this.handleSubmit}>
            <Detail
              type="text"
              editable={this.props.editable}
              name="name"
              pretty="Nazwa projektu"
              reuired
              value={this.props.project.name}
              handleChange={this.handleChange}
            />
            <Detail
              type="textarea"
              editable={this.props.editable}
              name="description"
              pretty="Opis"
              reuired
              rows={3}
              cols={30}
              value={this.props.project.description}
              handleChange={this.handleChange}
            />
            <Detail
              type="text"
              editable={this.props.editable}
              name="client"
              pretty="Klient"
              reuired
              value={this.props.project.client}
              handleChange={this.handleChange}
            />
            <Detail
              type="number"
              editable={this.props.editable}
              name="responsiblePerson"
              pretty="Osoba do kontaktu"
              reuired
              value={this.props.project.responsiblePerson}
              handleChange={this.handleChange}
            />
            <Detail
              type="date"
              editable={this.props.editable}
              name="startDate"
              pretty="Data rozpoczęcia"
              reuired
              value={this.props.project.startDate}
              handleChange={this.handleChange}
            />
            <Detail
              type="date"
              editable={this.props.editable}
              name="endDate"
              pretty="Data zakończenia"
              reuired
              value={this.props.project.endDate}
              handleChange={this.handleChange}
            />
            <div className="edit-project-button-container">
              <button className="">Potwierdź</button>
              <div className="col-sm-9 result-block">
                <ResultBlock
                  errorBlock={this.state.errorBlock}
                  errorOnly={false}
                  successMessage="Projekt edytowano pomyślnie"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProjectDetailsBlock;
