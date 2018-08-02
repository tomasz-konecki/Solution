import React, { Component } from "react";
import LoaderCircular from "./../common/LoaderCircular";
import Icon from "./../common/Icon";
import WebApi from "../../api";
import { withRouter } from "react-router";
import DetailCascade from "./DetailCascade";
import SkillRow from "./../skills/SkillRow";
import CapacitySlider from "./CapacitySlider";
import SenioritySlider from "./SenioritySlider";
import Modal from "react-responsive-modal";
import SkillsSelect from "./../skills/SkillsSelect";
import { translate } from "react-translate";
import TeamMember from "./../projects/TeamMember";
import {
  setActionConfirmation,
  setActionConfirmationProgress,
  setActionConfirmationResult
} from "./../../actions/asyncActions";
import { ACTION_CONFIRMED } from "./../../constants";
import { connect } from "react-redux";
import binaryPermissioner from "./../../api/binaryPermissioner";
import { push } from "react-router-redux";
import DegreeBar from './details/degreeBar/degreeBar';
import FteBar from './details/fteBar/fteBar';

class EmployeeDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      confirmed: false,
      invalidated: false,
      employeeLoadedSuccessfully: false,
      employeeActive: false,
      edit: false,
      skills: [],
      showModal: false,
      capacityLevel: 1,
      seniorityLevel: 1,
      rowUnfurls: {},
      team: []
    };

    this.skillsCache = [];
  }

  componentDidMount() {
    if (
      this.props.match.params.id === this.props.login ||
      binaryPermissioner(false)(0)(1)(1)(1)(1)(1)(this.props.binPem)
    )
      return this.getEmployee();

    this.props.dispatch(push("/main"));
  }

  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForAction(nextProps, "deleteProjectMember")) {
      this.props.dispatch(setActionConfirmationProgress(true));
      const { assignmentId } = this.props.toConfirm;
      WebApi.assignments
        .delete(assignmentId)
        .then(response => {
          this.props.dispatch(setActionConfirmationResult(response));
          this.getAssignments();
        })
        .catch(error => {
          this.props.dispatch(setActionConfirmationResult(error));
        });
    }
  }

  validatePropsForAction(nextProps, action) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === action
    );
  }

  capacityLevelToFraction(level, reverse = false) {
    if (reverse)
      switch (level - 0) {
        case 0.2:
          return 1;
        case 0.25:
          return 2;
        case 0.5:
          return 3;
        case 0.75:
          return 4;
        case 1:
          return 5;
      }
    switch (level - 0) {
      case 1:
        return 0.2;
      case 2:
        return 0.25;
      case 3:
        return 0.5;
      case 4:
        return 0.75;
      case 5:
        return 1;
    }
  }

  seniorityLevelToString(level, reverse = false) {
    if (reverse)
      switch (level) {
        case "Junior":
          return 1;
        case "Pro":
          return 2;
        case "Senior":
          return 3;
        case "Lead":
          return 4;
      }
    switch (level) {
      case 1:
        return "Junior";
      case 2:
        return "Pro";
      case 3:
        return "Senior";
      case 4:
        return "Lead";
    }
  }

  finishUp = () => {
    this.setState({
      loading: true
    });
    let { skills } = this.state;
    let newSkills = [];
    skills.forEach((skill, index) => {
      if (skill.skillName === undefined) {
        skill = {
          skillName: skill.name,
          skillId: skill.id,
          skillLevel: skill.level,
          yearsOfExperience: skill.yearsOfExperience
        };
      }
      newSkills.push(skill);
    });
    WebApi.employees.post
      .add({
        id: this.props.match.params.id,
        capacity: this.capacityLevelToFraction(this.state.capacityLevel),
        seniority: this.seniorityLevelToString(this.state.seniorityLevel),
        skills: newSkills
      })
      .then(confirmation => {
        this.setState({
          errorBlock: confirmation,
          edit: false
        });
        this.getEmployee();
      })
      .catch(error => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
  };

  saveSettings = () => {
    this.setState({
      loading: true
    });
    let { skills } = this.state;
    let newSkills = [];
    skills.forEach((skill, index) => {
      if (skill.skillId === undefined) {
        skill = {
          skillId: skill.id,
          skillName: skill.name,
          skillLevel: skill.level,
          yearsOfExperience: skill.yearsOfExperience
        };
      }
      // delete skill.skillName;
      // delete skill.name;
      newSkills.push(skill);
    });
    WebApi.employees.patch
      .data(this.props.match.params.id, {
        seniority: this.seniorityLevelToString(this.state.seniorityLevel),
        capacity: this.capacityLevelToFraction(this.state.capacityLevel)
      })
      .then(confirmation => {
        this.setState({
          errorBlock: confirmation,
          loading: true
        });
      })
      .then(WebApi.employees.put.skills(this.props.match.params.id, newSkills))
      .then(result => {
        this.setState(
          {
            errorBlock: result,
            edit: false
          },
          () => {
            this.getEmployee();
          }
        );
      })
      .catch(error => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
  };

  getContactInfo = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        WebApi.employees.get.emplo
          .contact(this.props.match.params.id)
          .then(result => {
            console.log(result);
            this.setState({
              errorBlock: result,
              contactInfo: result.extractData(),
              loading: false
            });
          })
          .catch(error => {
            this.setState({
              errorBlock: error,
              loading: false
            });
          });
      }
    );
  };

  getAssignments = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        WebApi.assignments.get
          .byEmployee(this.props.match.params.id)
          .then(result => {
            console.log(result);
            this.setState({
              errorBlock: result,
              team: result.extractData()
            });
            this.getContactInfo();
          })
          .catch(error => {
            this.setState({
              errorBlock: error,
              loading: false
            });
          });
      }
    );
  };

  getEmployee() {
    this.setState(
      {
        loading: true
      },
      () => {
        WebApi.employees.get
          .byEmployee(this.props.match.params.id)
          .then(result => {
            let extract = result.extractData();
            this.setState(
              {
                errorBlock: result,
                skills: extract.skills === null ? [] : extract.skills,
                loading: !extract.hasAccount,
                employeeLoadedSuccessfully: true,
                employeeActive: extract.hasAccount,
                employee: extract,
                capacityLevel: this.capacityLevelToFraction(
                  extract.baseCapacity,
                  true
                ),
                seniorityLevel: this.seniorityLevelToString(
                  extract.seniority,
                  true
                ),
                edit: !extract.hasAccount
              },
              () => {
                if (!this.state.employee.hasAccount) {
                  this.getEmploSkills();
                  return;
                } else {
                  this.getAssignments();
                  return;
                }
              }
            );
          })
          .catch(error => {
            if (error.response.data.errors.Employee === "Employee not found.") {
              this.getEmploSkills();
              return;
            }
            this.setState({
              errorBlock: error,
              loading: false
            });
          });
      }
    );
  }

  getEmploSkills = () => {
    WebApi.employees.get.emplo
      .skills(this.props.match.params.id)
      .then(emploSkills => {
        console.log(emploSkills);
        this.setState({
          errorBlock: emploSkills,
          skills: emploSkills.extractData(),
          edit: true
        });
        this.getContactInfo();
      })
      .catch(error => {
        this.setState({
          errorBlock: error,
          loading: false
        });
      });
  };

  handleSkillSelection = newSkill => {
    let duplicate = false;
    if (!this.state.changesMade)
      this.skillsCache = JSON.parse(JSON.stringify(this.state.skills));
    this.state.skills.map((skill, index) => {
      if (skill.skillId === newSkill.skillId) duplicate = true;
    });

    if (duplicate) return false;

    let copy = this.state.skills;
    copy.push(newSkill);
    this.setState({
      skills: copy,
      changesMade: true
    });

    return true;
  };

  handleSkillEdit = (updatedSkillObject, deletion = false) => {
    let { skills } = this.state;
    if (!this.state.changesMade)
      this.skillsCache = JSON.parse(JSON.stringify(skills));
    this.state.skills.forEach((skill, index) => {
      if (skill.skillName === undefined) {
        skill = {
          skillName: skill.name,
          skillId: skill.id
        };
      }
      if (skill.skillId === updatedSkillObject.skillId) {
        if (deletion) {
          skills.splice(index, 1);
        } else {
          skills[index] = updatedSkillObject;
        }

        this.setState({
          skills,
          changesMade: true
        });
      }
    });
  };

  handleRangeChange = skillObject => {
    return event => {
      let { skills } = this.state;
      if (!this.state.changesMade)
        this.skillsCache = JSON.parse(JSON.stringify(skills));
      skills.forEach((skill, index) => {
        // backend fixes!
        if (skill.skillName === undefined) {
          skill = {
            skillName: skill.name,
            skillId: skill.id
          };
        }
        if (skillObject.skillName === undefined) {
          skillObject = {
            skillName: skillObject.name,
            skillId: skillObject.id
          };
        }
        if (skill.skillId === skillObject.skillId) {
          skills[index].yearsOfExperience = event.target.value - 0;
          this.setState({
            skills,
            changesMade: true
          });
        }
      });
    };
  };

  getYearsOfExperience = index => {
    if (this.state.skills[index].yearsOfExperience !== undefined)
      return this.state.skills[index].yearsOfExperience;
    else return 0;
  };

  handleSeniorityChange = event => {
    this.setState({
      seniorityLevel: event.target.value - 0
    });
  };

  handleCapacityChange = event => {
    this.setState({
      capacityLevel: this.capacityLevelToFraction(event.target.value, true)
    });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  add = () => {
    this.setState({ showModal: true });
  };

  confirm = () => {
    this.saveSettings();
  };

  activate = () => {
    this.finishUp();
  };

  cancel = () => {
    this.setState({
      edit: false,
      changesMade: false,
      skills: this.skillsCache
    });
  };

  reset = () => {
    this.setState({
      confirmed: true,
      edit: false
    });
  };

  edit = () => {
    this.setState({
      confirmed: false,
      edit: true
    });
  };

  save = () => {
    this.setState(
      {
        confirmed: true,
        edit: false
      },
      () => {
        this.saveSettings();
      }
    );
  };

  mapSkills = (skills, editable = false) => {
    const { t } = this.props;
    if (skills === undefined || skills === null) {
      return t("ErrorOccuredSHNBS");
    }
    if (skills.length < 1) return t("NoSkills");
    return skills.map((skillObject, index) => {
      return (
        <SkillRow
          key={index}
          skill={skillObject}
          handleSkillEdit={this.handleSkillEdit}
          editable={this.state.edit}
        />
      );
    });
  };

  pullModalDOM = () => {
    return (
      <Modal
        open={this.state.showModal}
        classNames={{ modal: "Modal Modal-skills" }}
        contentLabel="Skills modal"
        onClose={this.handleCloseModal}
      >
        <SkillsSelect
          alreadySelected={this.state.skills}
          skillSelected={this.handleSkillSelection}
        />
      </Modal>
    );
  };

  pullEmployeeIdBlockDOM = () => {
    const { t } = this.props;
    const { employee } = this.state;
    return (
      <div className="col-sm-4 employee-id-block">
        <Icon icon="address-card" iconSize="2x" />
        <h1>
          {employee.firstName} {employee.lastName}
        </h1>
        {this.state.employeeActive ? (
          <h3 className="employee-active">{t("Active")}</h3>
        ) : (
            <h3 className="employee-inactive">{t("Inactive")}</h3>
          )}
        <hr className="sharp" />
        <div className="employee-headway">
          <DetailCascade
            lKey={t("Title")}
            rVal={employee.title}
            lColSize={4}
            rColSize={7}
          />
          <DetailCascade
            lKey={t("Seniority")}
            rVal={employee.seniority}
            lColSize={4}
            rColSize={7}
          />
        </div>
        <hr className="sharp" />
        <div className="employee-headway">
          <DetailCascade
            lKey={t("Localization")}
            rVal={employee.localization}
            lColSize={4}
            rColSize={7}
          />
          <DetailCascade
            dHref={`mailto:${employee.email}`}
            lKey={t("Email")}
            rVal={employee.email}
            lColSize={4}
            rColSize={7}
          />
        </div>
        {this.state.contactInfo !== undefined ? (
          <div>
            <hr />
            <div className="employee-headway">
              <DetailCascade
                dHref={`skype:${this.state.contactInfo.skypeID}?chat`}
                lKey={"Skype"}
                defVal="<brak>"
                rVal={this.state.contactInfo.skypeID}
                lColSize={4}
                rColSize={7}
              />
              <div className="text-bold employee-headway">Numery telefonu</div>
              <DetailCascade
                lKey={"#"}
                rVal={employee.phoneNumber}
                lColSize={4}
                rColSize={7}
                defVal="<brak>"
              />
              {this.state.contactInfo.telephoneNumber.map((number, index) => {
                return (
                  <DetailCascade
                    key={index}
                    lKey={"#"}
                    defVal="<brak>"
                    rVal={number}
                    lColSize={4}
                    rColSize={7}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        <hr className="sharp" />
        {this.state.edit === false ? this.pullInfoBlocksDOM() : null}
      </div>
    );
  };

  pullInfoBlocksDOM = () => {
    const { employee, seniorityLevel, employeeLoadedSuccessfully } = this.state;
    return (
      <div className="row employee-headway">
        <div className="col-sm-3">
          <DegreeBar
            seniority={seniorityLevel}
            range={4}
            operationStatus={employeeLoadedSuccessfully}
            operationErrors={[]}
            finalFunc={() => this.getEmployee()}
            employee={employee}
            seniorityName={employee.seniority}
          />
        </div>
        <div className="col-sm-9">
          <FteBar
            capacityLevel={employee.baseCapacity}
            capacityLeft={employee.capacityLeft}
            editable={this.state.edit}
          />
        </div>
      </div>
    );
  };

  pullEmployeeSettingsEditorDOM = () => {
    const { t } = this.props;
    return (
      <div className="row edc-selectors">
        <div className="col-sm-6">
          <label htmlFor="capacity-select">{t("Capacity")}</label>
          <select onChange={this.handleCapacityChange} name="capacity-select">
            <option />
            <option value="0.2">1/5</option>
            <option value="0.25">1/4</option>
            <option value="0.5">1/2</option>
            <option value="0.75">3/4</option>
            <option value="1">FTE</option>
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="seniority-select">{t("Seniority")}</label>
          <select onChange={this.handleSeniorityChange} name="seniority-select">
            <option />
            <option value="1">Junior</option>
            <option value="2">Pro</option>
            <option value="3">Senior</option>
            <option value="4">Lead</option>
          </select>
        </div>
      </div>
    );
  };

  pullEditToolbarDOM = () => {
    const { t } = this.props;
    return (
      <div>
        {this.state.employeeActive ? (
          <button onClick={this.cancel} className="dcmt-button">
            {t("Cancel")}
          </button>
        ) : null}
        <button onClick={this.add} className="dcmt-button button-success">
          {t("Add")}
        </button>
        {this.state.employeeActive ? (
          <button onClick={this.confirm} className="dcmt-button button-success">
            {t("Save")}
          </button>
        ) : (
            <button
              onClick={this.activate}
              className="dcmt-button button-success"
            >
              {t("Activate")}
            </button>
          )}
      </div>
    );
  };

  handleRowClick = (object, index) => {
    return e => {
      const { rowUnfurls } = this.state;

      if (rowUnfurls[index] === undefined) {
        rowUnfurls[index] = true;
      } else {
        rowUnfurls[index] = !rowUnfurls[index];
      }

      this.setState({
        rowUnfurls
      });
    };
  };

  deleteMember = assignment => e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.props.dispatch(
      setActionConfirmation(true, {
        key: "deleteProjectMember",
        string: `Wypisać ${assignment.firstName} ${
          assignment.lastName
          } z projektu ${assignment.projectName}`,
        assignmentId: assignment.assignmentId,
        successMessage: "Wypisano pracownika"
      })
    );
  };

  mapTeam = team => {
    console.log(team);
    return team.map((teamAssignment, index) => {
      let unfurled = this.state.rowUnfurls[index];
      return [
        <TeamMember
          onClick={this.handleRowClick(teamAssignment, index)}
          compact
          projectFlavor
          key={index}
          assignment={Object.assign({}, teamAssignment, this.state.employee)}
          delete={this.deleteMember}
        />,
        unfurled ? (
          <TeamMember
            onClick={this.handleRowClick(teamAssignment, index)}
            projectFlavor
            key={50000 - index}
            assignment={Object.assign({}, teamAssignment, this.state.employee)}
          />
        ) : null
      ];
    });
  };

  pullDOM = () => {
    const { t } = this.props;
    const { employee } = this.state;
    return (
      <div className="row">
        {this.state.employeeLoadedSuccessfully
          ? this.pullEmployeeIdBlockDOM()
          : null}
        <div className="col-sm-7 employee-headway">
          {this.state.edit ? this.pullEmployeeSettingsEditorDOM() : null}
          {this.state.employee.hasAccount && this.state.team.length > 0 ? (
            <table className="team-member-compact-table team-member-compact-project-flavor">
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Role</th>
                  <th>Seniority</th>
                  <th>Position</th>
                  <th>Ends</th>
                  <th>!</th>
                </tr>
              </thead>
              <tbody>{this.mapTeam(this.state.team)}</tbody>
            </table>
          ) : null}
          {this.mapSkills(this.state.skills)}
        </div>
        <div className="col-sm-1 employee-headway full-width-button">
          {this.state.edit === false ? (
            <button onClick={this.edit} className="dcmt-button">
              {t("Edit")}
            </button>
          ) : (
              this.pullEditToolbarDOM()
            )}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="content-container employee-detail-container">
        {this.pullModalDOM()}
        {this.state.loading ? <LoaderCircular /> : this.pullDOM()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.asyncReducer.loading,
    confirmed: state.asyncReducer.confirmed,
    toConfirm: state.asyncReducer.toConfirm,
    isWorking: state.asyncReducer.isWorking,
    resultBlock: state.asyncReducer.resultBlock,
    type: state.asyncReducer.type,
    binPem: state.authReducer.binPem,
    login: state.authReducer.login
  };
}

export default connect(mapStateToProps)(
  withRouter(translate("EmployeeDetailContainer")(EmployeeDetailContainer))
);
