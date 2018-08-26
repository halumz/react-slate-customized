import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fork from './components/fork';
import Toolbar from './components/toolbar';
import Editor from './components/editor';
import actions from './redux/slateValue/actions.js';

class App extends Component {
  componentDidMount() {
    this.props.initialLoading();
  }
  render() {
    return (
      <div style={{ maxWidth: '100vw' }}>
        <Toolbar {...this.props} />
        <Editor {...this.props} />
        <Fork />
      </div>
    );
  }
}

export default connect(state => state.SlateValue, actions)(App);
