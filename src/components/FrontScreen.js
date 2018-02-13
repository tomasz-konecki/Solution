import React from 'react'
import '../scss/FrontScreen.scss'
import LoginForm from '../components/LoginForm'

class FrontScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="front-screen">
        <p>{this.props.text}</p>
        <LoginForm />

      </div>
    )
  }
}

export default FrontScreen
