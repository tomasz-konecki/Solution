import React from "react";
import "./employeeCertificates.scss";
import Modal from "react-responsive-modal";
import EmployeeAddCertificate from "./employeeAddCertificate";
import Icon from "../../../common/Icon";
import { translate } from "react-translate";

class EmployeeCertificates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingCertificatesModalOpen: false,
      certificateToEdit: null,
      certificateToDelete: null,
      deletingCertificateState: false
    };
  }

  addCertificateModal = () => {
    this.setState({
      certificateToEdit: null,
      addingCertificatesModalOpen: true
    });
  };

  closeCertificatesModal = () => {
    this.setState({
      addingCertificatesModalOpen: false
    });
  };

  closeDeleteCertificateModal = () => {
    this.setState({
      deletingCertificateState: false
    });
  };

  editCertificate = certificate => {
    this.setState({
      certificateToEdit: certificate,
      addingCertificatesModalOpen: true
    });
  };

  render() {
    const { certificates, t, isYou, binPem } = this.props;

    return (
      <div className="emp-table">
        <h2>
          {t("Title")}
          {(isYou || binPem > 1) && (
            <span>
              <i onClick={this.addCertificateModal} title={t("Add")} className="fa fa-plus" />
            </span>
          )}
        </h2>

        <table>
          <thead>
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Description")}</th>
              <th>{t("Date")}</th>
              {(isYou || binPem > 1) && (
                <th>{t("Options")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {certificates.map(certificate => {
              return (
                <tr key={certificate.id}>
                  <td>{certificate.name}</td>
                  <td>{certificate.description}</td>
                  <td>{certificate.date.slice(0, 10)}</td>
                  {(isYou || binPem > 1) && (
                  <td className="options">
                    <div
                      onClick={() => this.editCertificate(certificate)}
                      title={t("Edit")}
                      className="option"
                    >
                      <Icon icon="pen-square" />
                    </div>
                    <div
                      onClick={() =>
                        this.props.deleteCertificate(
                          certificate,
                          t("Deleting", t("SuccesfullDelete"))
                        )
                      }
                      title={t("Delete")}
                      className="option"
                    >
                      <Icon icon="minus-square" />
                    </div>
                  </td>)}
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal
          key={1}
          open={this.state.addingCertificatesModalOpen}
          classNames={{ modal: "Modal Modal-add-owner" }}
          contentLabel="Add certificates modal"
          onClose={this.closeCertificatesModal}
        >
          <EmployeeAddCertificate
            loadCertificates={this.props.loadCertificates}
            userId={this.props.userId}
            closeModal={this.closeCertificatesModal}
            certificate={this.state.certificateToEdit}
            addCertificate={this.props.addCertificate}
            editCertificate={this.props.editCertificate}
            resultBlockAddCertificate={this.props.resultBlockAddCertificate}
            closeModal={this.closeCertificatesModal}
          />
        </Modal>

      </div>
    );
  }
}

export default translate("EmployeeCertificates")(EmployeeCertificates);
