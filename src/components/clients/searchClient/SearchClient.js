import React, { Component } from "react";
import "../../../scss/components/clients/searchClient/SearchClient.scss";

const SearchClient = ({ filter, t }) => {
  return (
    <div className="client-search-input">
      <input placeholder={t("Search")} onChange={e => filter(e)} />
    </div>
  );
};

export default SearchClient;
