import React, { Component } from "react";
import Icon from "../../../common/Icon";
import PropTypes from "prop-types";
import "./InfoClientList.scss";

export default class InfoClientList extends Component {
  state = {
    list: this.props.list,
    isDeleted: false
  };

  componentWillMount() {
    const list = this.state.list.filter(item => {
      return item.isDeleted === false;
    });
    this.setState({ list });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      let list;
      if (!this.state.isDeleted) {
        list = this.showDeleted(false, nextProps.list);
      } else {
        list = this.showDeleted(true, nextProps.list);
      }
      this.setState({ list });
    }
  }

  showDeleted = (bool, list) => {
    let newList;
    if (bool) {
      newList = list.filter(item => {
        return item.isDeleted === true;
      });
    } else {
      newList = list.filter(item => {
        return item.isDeleted === false;
      });
    }
    return newList;
  };

  handleChange = () => {
    const { isDeleted } = this.state;
    const { list } = this.props;
    const isDeletedPom = isDeleted;
    this.setState({
      isDeleted: !isDeleted,
      list: this.showDeleted(!isDeletedPom, list)
    });
  };

  render() {
    const {
      t,
      translateText,
      handleOpenAddItemModal,
      handleDeleteInfoList,
      handleReactivateInfoList
    } = this.props;

    const { list, isDeleted } = this.state;

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
              <button
                onClick={() =>
                  handleDeleteInfoList(
                    item.id,
                    item.name ? item.name : `${item.firstName} ${item.lastName}`
                  )
                }
              >
                <Icon
                  icon="times"
                  iconType="fa"
                  additionalClass="icon-danger"
                />
              </button>
            ) : (
              <button
                onClick={() =>
                  handleReactivateInfoList(
                    item.id,
                    item.name ? item.name : `${item.firstName} ${item.lastName}`
                  )
                }
              >
                <Icon
                  icon="sync-alt"
                  iconType="fa"
                  additionalClass="icon-danger"
                />
              </button>
            )}

            <button
              onClick={() =>
                handleOpenAddItemModal(
                  item
                  // item.id,
                  // item.name ? item.name : `${item.firstName} ${item.lastName}`
                )
              }
            >
              <Icon icon="edit" iconType="fa" additionalClass="icon-danger" />
            </button>
          </div>
        </div>
      );
    });
    return (
      <React.Fragment>
        <div className="info-client-list-header">
          <div className="info-client-list-header-title">
            <h2>{t(translateText.Header)}</h2>
          </div>
          <div className="info-client-list-header-input">
            <label className="switch">
              <input
                type="checkbox"
                onChange={this.handleChange}
                checked={!isDeleted}
              />
              <div className="slider" />
            </label>
          </div>
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
