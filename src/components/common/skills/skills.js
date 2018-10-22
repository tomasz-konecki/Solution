import React, { Component } from "react";
import "./skills.scss";
import ProgressPicker from "../progressPicker/progressPicker";
import { getRandomColor } from "../../../services/methods";
import SmallSpinner from "../spinner/small-spinner";
import Modal from "react-responsive-modal";
import Spinner from "../spinner/spinner";
import { isArrayContainsByObjectKey } from "../../../services/methods";
import CorrectOperation from "../correctOperation/correctOperation";
import { translate } from "react-translate";

class Skills extends Component {
  state = {
    items: [],
    isChanging: false,
    currentChangingIndex: null,
    changedValue: null,
    addSkillsModal: false,
    isLoadingSkillsForModal: false,
    allSkills: [],
    searchedSkills: [],
    showSearchBar: false,
    skillsHasBeedChanged: false,
    skillName: "",
    listToAddForProject: [],
    showAddList: false,
    isAddingNewSkills: false
  };
  fetchSkillsOnStart = skills => {
    const newSkills = [];
    for (let i = 0; i < skills.length; i++) {
      newSkills.push({
        startValue: skills[i].skillLevel,
        obj: skills[i],
        color: getRandomColor(),
        loading: false,
        error: ""
      });
    }
    return newSkills;
  };
  componentDidMount() {
    const items = this.fetchSkillsOnStart(this.props.items);
    this.setState({ items: items, listToAddForProject: items });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      let shouldCloseModal = nextProps.addSkillsToProjectStatus ? false : true;

      this.setState({
        skillsHasBeedChanged: false,
        isChanging: false,
        items: this.fetchSkillsOnStart(nextProps.items),
        isAddingNewSkills: false,
        showAddList: false
      });
      if (nextProps.addSkillsToProjectStatus) {
        setTimeout(() => {
          this.setState({ addSkillsModal: shouldCloseModal });
          this.props.addSkillsToProjectClear(null, []);
        }, 1000);
      }
    } else if (
      this.props.changeProjectSkillsErrors !==
      nextProps.changeProjectSkillsErrors
    )
      this.setState({ isChanging: false, isAddingNewSkills: false });
    else if (nextProps.loadSkillsStatus) {
      const fetchedSkills = this.fetchSkillsOnStart(nextProps.loadedSkills);
      this.setState({
        allSkills: fetchedSkills,
        searchedSkills: fetchedSkills,
        isLoadingSkillsForModal: false
      });
    } else if (this.props.loadSkillsErrors !== nextProps.loadSkillsErrors)
      this.setState({ isLoadingSkillsForModal: false });
    else if (
      this.props.addSkillsToProjectErrors !== nextProps.addSkillsToProjectErrors
    )
      this.setState({ isAddingNewSkills: false });
    else this.setState({ isAddingNewSkills: false });
  }

  changeSkill = (valueToChange, index, listName) => {
    const skill = valueToChange + 1;
    const items = [...this.state[listName]];
    items[index].startValue = skill;

    this.setState({ [listName]: items, skillsHasBeedChanged: true });
  };
  createProgressBtns = (number, color, startVal, index, listName) => {
    const btnsArray = [];
    const items = [...this.state[listName]];
    if (this.props.isProjectOwner) {
      for (let i = 0; i < number; i++) {
        btnsArray.push(
          <span
            style={{ backgroundColor: i + 1 <= startVal ? `${color}` : null }}
            onClick={e => this.changeSkill(i, index, listName)}
            key={i}
          >
            {i + 1 === startVal ? <i>{(startVal / 5) * 100}%</i> : null}
          </span>
        );
      }
    } else {
      for (let i = 0; i < number; i++) {
        btnsArray.push(
          <span
            style={{
              backgroundColor: i + 1 <= startVal ? `${color}` : null,
              cursor: "unset"
            }}
            key={i}
          >
            {i + 1 === startVal ? <i>{(startVal / 5) * 100}%</i> : null}
          </span>
        );
      }
    }

    return btnsArray;
  };
  saveChangedSkills = () => {
    this.setState({ isChanging: true });
    this.props.changeProjectSkills(
      this.props.projectId,
      this.state.items,
      this.props.onlyActiveAssignments
    );
  };
  getAllSkills = () => {
    this.setState({ addSkillsModal: true, isLoadingSkillsForModal: true });
    this.props.getAllSkills(this.state.items);
  };
  findSkillByName = e => {
    const typedValue = e.target.value.toLowerCase();
    const searchedSkills = [];
    const { allSkills, showAddList, listToAddForProject } = this.state;
    const whereShouldSearch = showAddList ? listToAddForProject : allSkills;
    if (whereShouldSearch.length > 0) {
      for (let key in whereShouldSearch) {
        const checkWhichItem = whereShouldSearch[key].obj.name
          ? whereShouldSearch[key].obj.name
          : whereShouldSearch[key].obj.skillName;
        if (checkWhichItem.toLowerCase().search(typedValue) !== -1)
          searchedSkills.push(whereShouldSearch[key]);
      }
    }

    this.setState({ searchedSkills: searchedSkills, skillName: typedValue });
  };
  addItemToProjectList = (id, index) => {
    const listToAddForProject = [...this.state.listToAddForProject];
    const allSkills = [...this.state.allSkills];
    const searchedSkills = [...this.state.searchedSkills];

    searchedSkills[index].startValue = searchedSkills[index].startValue
      ? searchedSkills[index].startValue
      : 1;
    listToAddForProject.push(searchedSkills[index]);

    const indexInAllSkills = allSkills.findIndex(index => {
      return index.obj.id === id;
    });
    const indexInSearchedSkills = searchedSkills.findIndex(index => {
      return index.obj.id === id;
    });
    allSkills.splice(indexInAllSkills, 1);
    searchedSkills.splice(indexInSearchedSkills, 1);

    this.setState({
      listToAddForProject: listToAddForProject,
      allSkills: allSkills,
      searchedSkills: searchedSkills
    });
  };
  showAddList = () => {
    const searchedSkills = [];
    const { listToAddForProject, showAddList, allSkills } = this.state;
    if (!showAddList) {
      for (let key in listToAddForProject)
        searchedSkills.push(listToAddForProject[key]);
    } else for (let key in allSkills) searchedSkills.push(allSkills[key]);

    this.setState({
      searchedSkills: searchedSkills,
      showAddList: !showAddList
    });
  };
  removeItemFromProjectList = (id, index) => {
    const listToAddForProject = [...this.state.listToAddForProject];
    const allSkills = [...this.state.allSkills];
    const searchedSkills = [...this.state.searchedSkills];

    allSkills.push(listToAddForProject[index]);

    const listToAddForProjectIndex = listToAddForProject.findIndex(item => {
      return item.obj.id === id;
    });
    listToAddForProject.splice(listToAddForProjectIndex, 1);

    searchedSkills.splice(index, 1);

    this.setState({
      listToAddForProject: listToAddForProject,
      allSkills: allSkills,
      searchedSkills: searchedSkills
    });
  };
  addSkillsToProject = () => {
    this.setState({ isAddingNewSkills: true });
    this.props.addSkillsToProject(
      this.props.projectId,
      this.state.listToAddForProject,
      this.props.onlyActiveAssignments
    );
  };
  closeModal = () => {
    this.setState({
      addSkillsModal: false,
      showAddList: false,
      showSearchBar: false
    });
    this.props.addSkillsToProjectClear(null, []);
  };
  render() {
    const {
      isChanging,
      addSkillsModal,
      isLoadingSkillsForModal,
      items,
      showSearchBar,
      skillName,
      searchedSkills,
      showAddList,
      isAddingNewSkills,
      listToAddForProject,
      skillsHasBeedChanged
    } = this.state;

    const {
      loadSkillsStatus,
      loadSkillsErrors,
      title,
      changeProjectSkillsErrors,
      changeProjectSkillsStatus,
      addSkillsToProjectStatus,
      addSkillsToProjectErrors,
      items: propsItems,
      isProjectOwner,
      t
    } = this.props;
    return (
      <div className="progress-bars-container">
        <h3>
          {title}

          {isProjectOwner && (
            <i
              onClick={this.getAllSkills}
              className="fa fa-plus"
              title={t("AddSkillsToProject")}
            />
          )}
          {changeProjectSkillsStatus === false && (
            <span>{changeProjectSkillsErrors[0]}</span>
          )}
          {isChanging && <SmallSpinner />}
        </h3>
        {items.map((i, index) => {
          return (
            <div key={i.obj.skillId} className="progress-bar-container">
              <b>{i.obj.skillName}</b>
              <ProgressPicker
                createResult={this.createProgressBtns(
                  5,
                  i.color,
                  i.startValue,
                  index,
                  "items"
                )}
              />
              {i.startValue !== i.obj.skillLevel && (
                <i className="fa fa-save" />
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div
            style={{ display: "block", textAlign: "center", color: "tomato" }}
          >
            {t("ThatProjectDoesntHavaAnySkillAssigned")}
          </div>
        )}

        {items.length > 0 && skillsHasBeedChanged && 
          isProjectOwner && (
            <button
              disabled={isChanging}
              onClick={this.saveChangedSkills}
              className="option-btn green-btn btn-abs"
            >
              {t("SaveChanges")}
            </button>
          )}
        <Modal
          key={1}
          open={addSkillsModal}
          classNames={{ modal: "Modal Modal-add-owner" }}
          contentLabel="Edit project modal"
          onClose={this.closeModal}
        >
          <header className="header-container">
            {showSearchBar && loadSkillsStatus ? (
              <input
                value={skillName}
                type="text"
                onChange={e => this.findSkillByName(e)}
                placeholder={t("InsertSkillName")}
              />
            ) : (
              <h3 className="section-heading">
                {t("AddSkillToProject")}
                {loadSkillsStatus && (
                  <i
                    onClick={() => this.setState({ showSearchBar: true })}
                    className="fa fa-search"
                  />
                )}
              </h3>
            )}

            {loadSkillsStatus && (
              <button onClick={this.showAddList} className="change-list-btn">
                {showAddList ? t("HideAdded") : t("ShowAdded")}
              </button>
            )}
          </header>

          {isLoadingSkillsForModal ? (
            <Spinner positionClass="abs-centered-content" fontSize="7px"/>
          ) : (
            <div className="modal-container">
              {loadSkillsStatus !== null && loadSkillsStatus ? (
                <div className="modal-progress-br-container">
                  {searchedSkills.length === 0 && (
                    <p className="empty-list">{t("NoResults")}</p>
                  )}

                  {searchedSkills.map((skill, index) => {
                    return (
                      <div key={index} className="progress-bar-container">
                        <b>
                          {skill.obj.name
                            ? skill.obj.name
                            : skill.obj.skillName}
                        </b>
                        <ProgressPicker
                          createResult={this.createProgressBtns(
                            5,
                            skill.color,
                            skill.startValue,
                            index,
                            "searchedSkills"
                          )}
                        />
                        {showAddList ? (
                          <i
                            onClick={() =>
                              this.removeItemFromProjectList(
                                skill.obj.id,
                                index
                              )
                            }
                            className="fa fa-minus"
                          />
                        ) : (
                          <i
                            onClick={() =>
                              this.addItemToProjectList(skill.obj.id, index)
                            }
                            className="fa fa-plus"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="server-error">{loadSkillsErrors[0]}</p>
              )}
              {!isLoadingSkillsForModal && (
                <button
                  disabled={isAddingNewSkills}
                  onClick={this.addSkillsToProject}
                  className="option-btn green-btn"
                >
                  {t("Confirm")}
                  {isAddingNewSkills && <SmallSpinner />}
                </button>
              )}

              {addSkillsToProjectStatus === false && (
                <p style={{ fontSize: "22px" }} className="server-error">
                  {addSkillsToProjectErrors[0]}
                </p>
              )}

              {addSkillsToProjectStatus &&
                !isAddingNewSkills && <CorrectOperation />}
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default translate("Skills")(Skills);
