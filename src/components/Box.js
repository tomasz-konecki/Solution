import React from 'react'
import '../scss/Box.scss'

class Box extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="box">
        <p>{this.props.text}</p>
      </div>
    )
  }
}

export default Box
