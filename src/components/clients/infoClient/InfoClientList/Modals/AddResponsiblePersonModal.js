import React, { PureComponent } from "react";
import Form from "../../../../form/form";
import PropTypes from "prop-types";

class AddResponsiblePersonModal extends PureComponent {
  state = {
    addResponsiblePersonToClientFormItems: [
      {
        title: this.props.t("FirstName"),
        name: "firstName",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("FirstName")}`,
        mode: "text",
        value: "",
        error: "",
        canBeNull: false,
        inputType: "firstName",
        maxLength: 100,
        minLength: 2
      },
      {
        title: this.props.t("LastName"),
        name: "lastName",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("LastName")}`,
        mode: "text",
        value: "",
        error: "",
        canBeNull: false,
        inputType: "lastName",
        maxLength: 100,
        minLength: 2
      },
      {
        title: this.props.t("Email"),
        name: "email",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("Email")}`,
        mode: "text",
        value: "",
        error: "",
        canBeNull: false,
        inputType: "email"
      },
      {
        title: this.props.t("PhoneNumber"),
        name: "phoneNumber",
        type: "text",
        placeholder: `${this.props.t("Insert")} ${this.props.t("PhoneNumber")}`,
        mode: "text",
        value: "",
        error: "",
        canBeNull: false,
        inputType: "phoneNumber",
        maxLength: 20,
        minLength: 7
      }
    ],
    isLoading: false
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.resultBlockResponsiblePerson !==
      nextProps.resultBlockResponsiblePerson
    ) {
      this.setState({ isLoading: false }),
        nextProps.resultBlockResponsiblePerson &&
          nextProps.resultBlockResponsiblePerson.statusCode() === 200 &&
          setTimeout(() => {
            this.props.handleResponsiblePersonAddCloseModal();
          }, 3000);
    }
  }

  addResponsiblePersonHandler = () => {
    const { handleAddResponsiblePerson, clientName } = this.props;
    const { addResponsiblePersonToClientFormItems } = this.state;
    this.setState({ isLoading: true }),
      handleAddResponsiblePerson(
        addResponsiblePersonToClientFormItems[0].value,
        addResponsiblePersonToClientFormItems[1].value,
        clientName,
        addResponsiblePersonToClientFormItems[2].value,
        addResponsiblePersonToClientFormItems[3].value
      );
  };

  render() {
    const { t, resultBlockResponsiblePerson } = this.props;
    const { addResponsiblePersonToClientFormItems, isLoading } = this.state;
    return (
      <div className="add-client-container">
        <header>
          <h3 className="section-heading">{t("AddResponsivePerson")}</h3>
        </header>

        <Form
          btnTitle={t("Add")}
          shouldSubmit={true}
          onSubmit={this.addResponsiblePersonHandler}
          isLoading={isLoading}
          formItems={addResponsiblePersonToClientFormItems}
          submitResult={{
            status: resultBlockResponsiblePerson
              ? !resultBlockResponsiblePerson.errorOccurred()
                ? true
                : false
              : null,
            content: resultBlockResponsiblePerson
              ? !resultBlockResponsiblePerson.errorOccurred()
                ? t("ResponsiblePersonAdded")
                : resultBlockResponsiblePerson &&
                  resultBlockResponsiblePerson.getMostSignificantText()
              : null
          }}
        />
      </div>
    );
  }
}

AddResponsiblePersonModal.propTypes = {
  resultBlockResponsiblePerson: PropTypes.object,
  clientName: PropTypes.string
};

AddResponsiblePersonModal.defaultProps = {
  resultBlockResponsiblePerson: null
};

export default AddResponsiblePersonModal;
