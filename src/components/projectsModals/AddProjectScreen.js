import React, { Component } from "react";
import "../../scss/components/projectsModals/AddProjectScreen.scss";

class AddProjectScreen extends Component {
  render() {
    return (
      <div className="add-project-screen">
        <form onSubmit={this.handleSubmit}>
          <div className="input-block">
            <label>Nazwa projektu: </label>
            <input type="text" onChange={this.handleChange} />
          </div>
          <div className="input-block">
            <label>Opis:</label>
            <textarea
              onChange={this.handleChange}
              style={{ height: 50, width: 200 }}
            />
          </div>
          <div className="input-block">
            <label>Klient:</label>
            <input type="text" onChange={this.handleChange} />
          </div>
          <div className="input-block">
            <label>Osoba do kontaktu:</label>
            <input type="text" onChange={this.handleChange} />
          </div>
          <div className="input-block">
            <label>Data rozpoczęcia:</label>
            <input type="text" onChange={this.handleChange} />
          </div>
          <div className="input-block">
            <label>Data zakończenia:</label>

            <input type="text" onChange={this.handleChange} />
          </div>
          <div className="project-submit-container">
            <button className="project-submit-button">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddProjectScreen;
