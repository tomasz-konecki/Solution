import React, { Component } from "react";
import "../../scss/components/projectsModals/AddProjectScreen.scss";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import DCMTWebApi from "../../api";
import ResultBlock from "./../common/ResultBlock";

class AddProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      id: Math.floor(Math.random() * 101),
      description: "",
      client: "",
      responsiblePerson: 0,
      startDate: new Date(),
      endDate: new Date(),
      createdBy: "tkonecki",
      isActive: true,
      isLoading: false,
      errorBlock: null
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  getResponse = newProject => {
    DCMTWebApi.addProject(newProject)
      .then(response => {
        this.props.projectActions.loadProjects(
          this.props.currentPage,
          this.props.limit
        );
        this.setState({
          errorBlock: { response },
          isLoading: false
        });
        setTimeout(() => {
          this.props.closeModal();
        }, 500);
      })
      .catch(errorBlock => {
        this.setState({
          errorBlock,
          isLoading: false
        });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });

    const newProject = this.state;
    this.getResponse(newProject);
  };

  render() {
    return (
      <div className="add-project-screen">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label htmlFor="projectName" className="col-sm-3 col-form-label">
              Nazwa projektu:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-3 col-form-label">
              Opis:
            </label>
            <div className="col-sm-9">
              <textarea
                rows="5"
                cols="30"
                className="form-control"
                name="description"
                maxLength="1500"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client" className="col-sm-3 col-form-label">
              Klient:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="client"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client" className="col-sm-3 col-form-label">
              Osoba do kontaktu:
            </label>
            <div className="col-sm-9">
              <input
                type="number"
                min="1"
                className="form-control"
                name="responsiblePerson"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client" className="col-sm-3 col-form-label">
              Data rozpoczęcia:
            </label>
            <div className="col-sm-9">
              <input
                type="date"
                className="form-control"
                name="startDate"
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="client" className="col-sm-3 col-form-label">
              Data zakończenia:
            </label>
            <div className="col-sm-9">
              <input
                type="date"
                className="form-control"
                name="endDate"
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className="loading-bar-container">
            {this.state.isLoading === true && <LoaderHorizontal />}
          </div>

          <div className="form-group row">
            <div className="col-sm-9 result-block">
              <ResultBlock
                errorBlock={this.state.errorBlock}
                errorOnly={false}
                successMessage="Projekt dodano pomyślnie"
              />
            </div>
            <div className="project-submit-container col-sm-3">
              <button className="project-submit-button">Potwierdź</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddProjectScreen;
