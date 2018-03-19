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
          <div className="input-block">
            <label>Nazwa projektu: </label>
            <input
              type="text"
              name="name"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-block">
            <label>Opis:</label>
            <textarea
              onChange={this.handleChange}
              name="description"
              maxLength="1500"
            />
          </div>
          <div className="input-block">
            <label>Klient:</label>
            <input
              type="text"
              name="client"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-block">
            <label>Osoba do kontaktu:</label>
            <input
              type="number"
              name="responsiblePerson"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-block">
            <label>Data rozpoczęcia:</label>
            <input
              type="date"
              name="startDate"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-block">
            <label>Data zakończenia:</label>

            <input
              type="date"
              name="endDate"
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="loading-bar-container">
            {this.state.isLoading === true && <LoaderHorizontal />}
          </div>

          <div className="project-submit-container">
            <button className="project-submit-button">Submit</button>
          </div>
          <div>
            <ResultBlock
              errorBlock={this.state.errorBlock}
              errorOnly={false}
              successMessage="Projekt dodano pomyślnie"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default AddProjectScreen;
