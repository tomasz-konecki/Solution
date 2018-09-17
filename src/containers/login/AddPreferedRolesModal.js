import React from 'react'
import { connect } from "react-redux";
import IntermediateBlock from "../../components/common/IntermediateBlock";
import { loadRoles, addRoles } from '../../actions/usersActions';
import { CSSTransitionGroup } from "react-transition-group";
import { translate } from 'react-translate';

class AddPreferedRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedRoles: false,
      choosenRoles: new Map(),
      isLoading: false,
      buttonDisabled: true
    };
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if(nextProps.loadRolesStatus && nextProps.loadRolesStatus === true){
      this.setState({
        loadedRoles: nextProps.loadRolesStatus
      })
    }

    if(nextProps.userId && nextProps.userId === prevProps.userId){
      this.props.closeModal();
    }
  }

  handleChange = e => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(
        prevState => ({ choosenRoles: prevState.choosenRoles.set(item, isChecked) }),
        () => {
          const userRoles = {
            id: this.props.userId,
            roles: []
          };

          for (let [key, value] of this.state.choosenRoles.entries()) {
            if (value === true)
              userRoles.roles.push(key)
          }

          if(userRoles.roles.length > 0){
            this.setState({
              buttonDisabled: false
            })
          }else{
            this.setState({
              buttonDisabled: true
            })
          }
        }
      );
  };

  handleSubmit = e => {
    e.preventDefault();

    const userRoles = {
      id: this.props.userId,
      roles: []
    };

    for (let [key, value] of this.state.choosenRoles.entries()) {
      if (value === true)
        userRoles.roles.push(key)
    }

    this.setState({
      isLoading: true
    })
    this.props.addRoles(userRoles)
  }

  componentDidMount() {
    this.props.loadRoles();
  }

  pullDom = (t) => {
    return (
      <div>
        <header>
            {t("ChooseRoles")}
        </header>
        <form onSubmit={this.handleSubmit}>
          {this.state.loadedRoles && this.props.roles.map((role) => {
                return (
                  <div key={role}>
                    <input type="checkbox" name={role} onChange={this.handleChange} checked={this.state.choosenRoles.get(role) || false} />
                    <label htmlFor="role">{role}</label>
                  </div>
                )
            })}
            <button type="submit" disabled={this.state.buttonDisabled}>{t("Save")}</button>
        </form>
      </div>
    )
  }

  render() {
    const { t } = this.props;
    let info = null;

    if (this.props.resultBlockAddRoles) {
      if (this.props.resultBlockAddRoles.replyBlock.status === 200) {

        info = (
          <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={1000}
            transitionEnter={false}
            transitionLeave={false}
          >
            <div className="certificate-modified-success">
              <span>
                {t("SavedSuccessfully")}
              </span>
            </div>
          </CSSTransitionGroup>
        );
      }
      if(this.state.isLoading){
          setTimeout(() => {
              this.props.closeModal()
            }, 2000);

        }
    }

    return (
      <div>
        <IntermediateBlock
          loaded={!this.state.isLoading}
          render={() => this.pullDom(t)}
          resultBlock={this.props.resultBlockAddRoles}
          spinner="Cube"
        />
        {info}
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    roles: state.usersReducer.roles,
    loadRolesErrors: state.usersReducer.loadRolesErrors,
    loadRolesStatus: state.usersReducer.loadRolesStatus,
    resultBlockAddRoles: state.usersReducer.resultBlockAddRoles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadRoles: () => dispatch(loadRoles()),
    addRoles: (userRoles) => dispatch(addRoles(userRoles))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("PreferedRoles")(AddPreferedRoles));

