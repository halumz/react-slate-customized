import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon, Toolbar } from './basic';
import { DEFAULT_NODE, plugin } from '../config';

const insertImage = (change, src, target) => {
  if (target) {
    change.select(target);
  }
  change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src }
  });
};

export default class extends Component {
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };
  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);
    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.props;
      const parent = value.document.getParent(value.blocks.first().key);
      isActive = this.hasBlock('list-item') && parent && parent.type === type;
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };
  renderListButton = (type, icon) => {
    const { wrapInList, unwrapList } = plugin.changes;
    const inList = plugin.utils.isSelectionInList(this.props.value);
    const call = change => {
      this.props.changeValue(this.props.value.change().call(change).value);
    };

    return (
      <Button
        active={inList}
        onMouseDown={() => call(inList ? unwrapList : wrapInList)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };
  hasMark = type => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type === type);
  };
  hasBlock = type => {
    const { value } = this.props;
    return value.blocks.some(node => node.type === type);
  };
  onClickImage = event => {
    event.preventDefault();
    const src = window.prompt('Enter the URL of the image:');
    if (!src) return;
    const change = this.props.value.change().call(insertImage, src);
    this.props.changeValue(change.value);
  };
  onDropImage = acceptedFiles => {
    acceptedFiles.forEach(file => {
      const change = this.props.value.change().call(insertImage, file.preview);
      this.props.changeValue(change.value);
    });
  };
  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const change = value.change().toggleMark(type);
    this.props.changeValue(change.value);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { value } = this.props;
    const change = value.change();

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    }
    this.props.changeValue(change.value);
  };

  render() {
    return (
      <Toolbar
        style={{
          background: '#1A1A1A',
          display: 'flex',
          padding: 10,
          justifyContent: 'center',
          maxWidth: '100vw'
          // height:'10vh'
        }}
      >
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'looks_one')}
        {this.renderBlockButton('heading-two', 'looks_two')}
        {this.renderBlockButton('block-quote', 'format_quote')}
        {this.renderListButton('bulleted-list', 'format_list_bulleted')}
        <Button onMouseDown={this.onClickImage}>image link</Button>

        <Dropzone
          onDrop={this.onDropImage}
          style={{ height: '100%', borderWidth: 0 }}
          accept="image/jpeg, image/png"
        >
          <Button>image upload</Button>
        </Dropzone>
        <Button style={{ color: '#00ff00' }} onClick={this.props.onSave}>
          Save
        </Button>
        <Button style={{ color: '#ff0000' }} onClick={this.props.onCancel}>
          Cancel
        </Button>
      </Toolbar>
    );
  }
}
