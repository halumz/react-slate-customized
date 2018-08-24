import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toolbar from './components/toolbar';
import Editor from './components/editor';
import actions from './redux/slateValue/actions.js';

class CustomizedSlate extends Component {
  render() {
    return (
      <div>
        <Toolbar {...this.props} />
        <Editor {...this.props} />
      </div>
    );
  }
}

export default connect(state => state.SlateValue, actions)(CustomizedSlate);
