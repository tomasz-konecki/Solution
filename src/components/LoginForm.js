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
              <input type="text" placeholder="Enter Username" name="uname" required />
            </div>

            <div className="password-container">
              <input type="password" placeholder="Enter Password" name="psw" required />
            </div>

            <div className="centric-container">
              <button type="submit">Login</button>
            </div>
<<<<<<< HEAD
=======
            
>>>>>>> f02d249341751b05b69fafe57bc06a2b44d4d717
          </div>

          <div className="container">
            <span className="psw">Forgot <a href="#">password?</a></span>

            <label className="checkbox-container remember-me">
              <input type="checkbox" checked="checked" name="remember" /> Remember me
            </label>
          </div>
        </form>
      </div>
    )
  }

}
export default LoginForm
