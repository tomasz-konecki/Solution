import React from "react";
import Modal from "react-responsive-modal";
import Form from '../../form/form';
const addCloud = ({shouldOpenModal, closeModal}) => {
  return (
    <Modal
      key={2}
      open={shouldOpenModal}
      classNames={{ modal: "Modal Modal-cloud-modal" }}
      contentLabel="Add cloud to list"
      onClose={closeModal}
    >
      <h3>Dodaj chmurę do listy</h3>
    </Modal>
  );
};

export default addCloud;
