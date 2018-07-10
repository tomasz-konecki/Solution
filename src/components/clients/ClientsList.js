import React from "react";
import ClientNameInput from "./ClientNameInput";

const ClientsList = ({
  clients,
  options,
  editingInput,
  handleGetValueFromInput
}) => {
  const listOfClients = clients.map((item, index) => {
    let name =
      editingInput === index ? (
        <ClientNameInput
          value={item.name}
          handleGetValueFromInput={handleGetValueFromInput}
        />
      ) : (
        item.name
      );
    return (
      <tr key={index}>
        <td>{name}</td>
        <td>{options(item.id, item.isDeleted, item.name, index)}</td>
      </tr>
    );
  });
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>{listOfClients}</tbody>
    </table>
  );
};

export default ClientsList;
