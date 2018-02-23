import React from 'react';
import { connect } from 'react-redux';
import PropTypes from '../../../../../node_modules/prop-types/checkPropTypes';
import { loadUsers } from '../../../../actions/usersActions';

class UsersContainer extends React.Component {
	constructor(props) {
		super(props);
		this.props.loadUsers;
	}

	render() {
		return <div>Users Container</div>;
	}
}

UsersContainer.propTypes = {
	dispatch: PropTypes.func,
	users: PropTypes.array
};

function mapStateToProps(state) {
	return {
		users: state.users
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUsers: () => {
			dispatch(loadUsers);
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
