import { connect } from 'react-redux';
import PrivateRouteContainer from "../containers/PrivateRouteContainer";

export const PrivateRoute = connect(state => ({
  isAuthenticated: state.authReducer.isAuthenticated
}))(PrivateRouteContainer);
