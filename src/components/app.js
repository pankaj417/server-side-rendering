import React, { Component } from 'react';
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <div className="container">
      	{this.props.children}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(App)
