import React from "react";
import { translate } from "react-translate";
import './employeeFeedbacks.scss';

class EmployeeFeedbacks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { employeeFeedbacks, t } = this.props;

    return (
      <React.Fragment>
      {employeeFeedbacks && employeeFeedbacks.length > 0 &&
        <div className="emp-table-feedbacks">
          <h2>
            {t("Feedbacks")}
          </h2>
          <table>
            <thead>
              <tr>
                <th>{t("Author")}</th>
                <th>{t("Content")}</th>
                <th>{t("Project")}</th>
                <th>{t("Client")}</th>
              </tr>
            </thead>
            <tbody>
              {employeeFeedbacks.map(employeeFeedback => {
                return (
                  <tr key={employeeFeedback.id}>
                    <td>{employeeFeedback.author}</td>
                    <td>{employeeFeedback.description}</td>
                    <td>{employeeFeedback.project}</td>
                    <td>{employeeFeedback.client}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
      </React.Fragment>
    )
  }
}

export default translate("EmployeeFeedbacks")(EmployeeFeedbacks);
