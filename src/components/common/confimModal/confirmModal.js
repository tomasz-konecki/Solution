import React from 'react'
import './confirmModal.scss';
import Modal from 'react-responsive-modal';

const confirmModal = ({open, content, onClose, header, 
    operation, operationName, children}) => (
    <Modal
    key={2}
    open={open}
    classNames={{ modal: "Modal Modal-add-owner" }}
    contentLabel={content}
    onClose={onClose}
    >
        <div className="delete-content-modal">
            <h2>{header}</h2>
            <div>
                <button className="option-btn green-btn" onClick={operation}>{operationName}</button>
                <button className="option-btn" 
                onClick={onClose}>Anuluj</button>
            </div>
        </div>
        {children}
    </Modal>
);

export default confirmModal;