import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Block, Value } from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';
import Dropzone from 'react-dropzone';
import initValue from './value.json';
import { isKeyHotkey } from 'is-hotkey';
import { Button, Icon, Toolbar, Image } from './components';

const DEFAULT_NODE = 'paragraph';
const DEFAULT_STORAGE_KEY = 'CustomizedSlate';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

let initialValue = localStorage.getItem(DEFAULT_STORAGE_KEY);
if (!initialValue) {
  initialValue = initValue;
} else {
  console.log(initialValue);
  initialValue = JSON.parse(initialValue);
}

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

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (change, reason, { node, child }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Block.create('paragraph');
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
        default:
          return undefined;
      }
    }
  }
};

class CustomizedSlate extends Component {
  state = {
    value: Value.fromJS(initialValue)
  };
  onClickImage = event => {
    event.preventDefault();
    const src = window.prompt('Enter the URL of the image:');
    if (!src) return;
    const change = this.state.value.change().call(insertImage, src);
    this.onChange(change);
  };
  onDropImage = acceptedFiles => {
    acceptedFiles.forEach(file => {
      const change = this.state.value.change().call(insertImage, file.preview);
      this.onChange(change);
    });
  };
  onSave = () => {
    console.log(this.state.value, this.state.value.toJSON());
    localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(this.state.value));
  };
  onCancel = () => {
    localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(initialValue));
    this.setState({ value: Value.fromJSON(initialValue) });
  };
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };
  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };
  render() {
    return (
      <div>
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
          <Button onMouseDown={this.onClickImage}>
            <Icon>image_link</Icon>
          </Button>

          <Dropzone
            onDrop={this.onDropImage}
            style={{ height: '100%', borderWidth: 0 }}
            accept="image/jpeg, image/png"
          >
            <Button>
              <Icon>image_upload</Icon>
            </Button>
          </Dropzone>
          <Button style={{ color: '#00ff00' }} onClick={this.onSave}>
            Save
          </Button>
          <Button style={{ color: '#ff0000' }} onClick={this.onCancel}>
            Cancel
          </Button>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          schema={schema}
          onDrop={this.onDropImage}
        />
      </div>
    );
  }

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
      const { value } = this.state;
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

  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'image': {
        const src = node.data.get('src');
        return <Image src={src} selected={isFocused} {...attributes} />;
      }
      default:
        return null;
    }
  };

  renderMark = props => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return null;
    }
  };
  onChange = ({ value }) => {
    this.setState({ value });
  };

  onKeyDown = (event, change) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

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
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        change.setBlocks('list-item').wrapBlock(type);
      }
    }

    this.onChange(change);
  };
}

export default CustomizedSlate;
