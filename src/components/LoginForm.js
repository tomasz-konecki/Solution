import React from 'react'
import '../scss/LoginForm.scss'


class LoginForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container login-form">
        <form action="" method="post">

          <div className="container login-details">

            <div className="user-container">
              <label htmlFor="uname"><b>Username</b></label>
              <input type="text" placeholder="Enter Username" name="uname" required />
            </div>

            <div className="password-container">
              <label htmlFor="psw"><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="psw" required />
            </div>


              <button type="submit">Login</button>
              <label>
                <input type="checkbox" checked="checked" name="remember" /> Remember me
              </label>

          </div>

          <div className="container" >
            <span className="psw">Forgot <a href="#">password?</a></span>
          </div>

        </form>
      </div>
    )
  }

}
export default LoginForm
