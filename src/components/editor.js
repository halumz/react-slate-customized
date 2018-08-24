import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Image } from './basic';

import {
  DEFAULT_NODE,
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey,
  isTabHotKey,
  schema
} from '../config';

export default class extends Component {
  hasBlock = type => {
    const { value } = this.props;
    return value.blocks.some(node => node.type === type);
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
    this.props.changeValue(value);
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
    } else if (isTabHotKey(event)) {
      console.log(12, event.shiftKey, change);
      event.preventDefault();
      return;
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
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
  render() {
    return (
      <Editor
        spellCheck
        autoFocus
        placeholder="Enter some text..."
        value={this.props.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        schema={schema}
        onDrop={this.onDropImage}
      />
    );
  }
}
