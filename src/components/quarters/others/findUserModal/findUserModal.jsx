import React from 'react'
import './findUserModal.scss';
import Modal from 'react-responsive-modal';
import Form from '../../../form/form.js';
class FindUserModal extends React.PureComponent{
    state = {
        findUserFormItems: [
            {
                title: "Pracownik",
                type: "text",
                placeholder: "znajdź pracownika...",
                mode: "type-ahead",
                value: "",
                error: "",
                inputType: "client",
                minLength: 3,
                maxLength: 100,
                canBeNull: false
            }
        ],
        shouldAddToLastWatchedUsers: false
    }

    redirectToSearchedEmployee = () => {
        const { changeActualWatchedUser } = this.props;
        const { findUserFormItems } = this.state;
        const foundEmployee = findUserFormItems[0].value;

        changeActualWatchedUser(foundEmployee);
        
    }
    render(){
        const { onClose, open } = this.props;
        const { findUserFormItems, isChecking } = this.state;
        return (
            <Modal
            open={open}
            classNames={{ modal: `Modal Find-user-modal`}}
            contentLabel="Find user modal"
            onClose={onClose}
            >
                <header>
                    <h3>Znajdź użytkownika do przeglądania</h3>
                </header>
                <Form
                    btnTitle="Przejdź"
                    onSubmit={this.redirectToSearchedEmployee}
                    isLoading={false}
                    shouldSubmit={false}
                    formItems={findUserFormItems}
                    enableButtonAfterTransactionEnd
                />

            </Modal>
        );
    }
}

export default FindUserModal;