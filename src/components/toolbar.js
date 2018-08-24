import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon, Toolbar } from './basic';

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
    this.onChange(change);
  };
  onDropImage = acceptedFiles => {
    acceptedFiles.forEach(file => {
      const change = this.props.value.change().call(insertImage, file.preview);
      this.onChange(change);
    });
  };
  onSave = () => {
    // console.log(this.props.value, this.props.value.toJSON());
    // localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(this.props.value));
  };
  onCancel = () => {
    // localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(initialValue));
    // this.setState({ value: Value.fromJSON(initialValue) });
  };
  render() {
    return (
      <Toolbar style={{ background: '#1A1A1A' }}>
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'looks_one')}
        {this.renderBlockButton('heading-two', 'looks_two')}
        {this.renderBlockButton('block-quote', 'format_quote')}
        {this.renderBlockButton('numbered-list', 'format_list_numbered')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        <Button onMouseDown={this.onClickImage}>image_link</Button>

        <Dropzone
          onDrop={this.onDropImage}
          style={{ height: '100%', borderWidth: 0 }}
          accept="image/jpeg, image/png"
        >
          <Button>image_upload</Button>
        </Dropzone>
        <Button style={{ color: '#00ff00' }} onClick={this.onSave}>
          Save
        </Button>
        <Button style={{ color: '#ff0000' }} onClick={this.onCancel}>
          Cancel
        </Button>
      </Toolbar>
    );
  }
}
