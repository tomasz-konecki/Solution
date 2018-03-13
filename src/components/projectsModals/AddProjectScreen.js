import React, { Component } from "react";
import "../../scss/components/projectsModals/AddProjectScreen.scss";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import DCMTWebApi from "../../api";

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
      createdBy: "wolczak",
      isActive: true,
      isLoading: false,
      result: "",
      resultColor: "green"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleStatus(status) {
    status === 200
      ? this.setState({
          result: "Projekt dodany pomyślnie",
          resultColor: "green"
        })
      : this.setState({
          result: "Coś poszło nie tak...",
          resultColor: "red"
        });
  }

  getResponse(newProject) {
    console.table(newProject);
    setTimeout(() => {
      DCMTWebApi.addProject(newProject, false)
        .then(response => {
          console.log("Response:", response.status);
          this.handleStatus(response.status);
        })
        .catch(error => {
          throw error;
        });
      this.setState({
        isLoading: false,
        result: "OK"
      });
      this.props.projectActions.loadProjects(1, newProject);
    }, 2000);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      isLoading: true
    });

    // let newProject = {
    //   name: "",
    //   description: "",
    //   client: "",
    //   responsiblePerson: "",
    //   startDate: "",
    //   endDate: "",
    //   isActive: true
    // };

    const newProject = this.state;
    this.getResponse(newProject);
  }

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
              style={{ height: 50, width: 200 }}
              name="description"
              required
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
            <div
              className={["submit-result", this.state.resultColor].join(" ")}
            >
              {this.state.result}
            </div>
            <button className="project-submit-button">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddProjectScreen;
