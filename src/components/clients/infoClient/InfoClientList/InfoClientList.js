import React, { Component } from "react";
import Icon from "../../../common/Icon";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";
import "./InfoClientList.scss";
import IntermediateBlock from "../../../common/IntermediateBlock";

export default class InfoClientList extends Component {
  render() {
    const { t, list, translateText, handleOpenAddItemModal } = this.props;

    const clientInfoList = list.map((item, index) => {
      return (
        <div key={index} className="info-list-item">
          <div className="info-list-circle" />
          <div className="info-list-name">
            <span>
              {item.name ? item.name : item.firstName + " " + item.lastName}
            </span>
          </div>
          <div className="info-list-options">
            {!item.isDeleted ? (
              <button onClick={() => handleDeleteInfoList(item.id, item.name)}>
                <Icon
                  icon="times"
                  iconType="fa"
                  additionalClass="icon-danger"
                />
              </button>
            ) : (
              <button
                onClick={() => handleReactivateInfoList(item.id, item.name)}
              >
                <Icon
                  icon="sync-alt"
                  iconType="fa"
                  additionalClass="icon-danger"
                />
              </button>
            )}
          </div>
        </div>
      );
    });

    // const addingItemToList = (
    //   <div className="info-list-item">
    //     <div className="info-list-circle" />
    //     <div className="info-list-name">
    //       <input
    //         onChange={e => handleInputAddCloud(e)}
    //         onKeyPress={e => {
    //           if (e.key === "Enter") {
    //             handleAddCloudSaveChild();
    //           }
    //         }}
    //         placeholder={t(translateText.ItemName)}
    //         // value={inputValueToAdd}
    //       />
    //     </div>
    //     <div className="info-list-options">
    //       <button disabled={true}>
    //         <Icon icon="check" iconType="fa" additionalClass="icon-success" />
    //       </button>
    //       <button>
    //         <Icon icon="times" iconType="fa" additionalClass="icon-danger" />
    //       </button>
    //     </div>
    //   </div>
    // );

    return (
      <React.Fragment>
        <div className="info-client-list-header">
          <h2>{t(translateText.Header)}</h2>
        </div>
        <div className="info-client-list">
          {clientInfoList}
          {clientInfoList.length === 0 && (
            <span className="info-client-not-found">
              {t(translateText.NotFound)}
            </span>
          )}
          <div className="info-list-adding-container">
            <div className="info-item-add">
              <button onClick={() => handleOpenAddItemModal()}>
                <Icon icon="plus" iconType="fa" />
                {t(translateText.AddItem).toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

InfoClientList.propTypes = {
  translateText: PropTypes.objectOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  handleOpenAddItemModal: PropTypes.func.isRequired
};
