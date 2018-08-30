import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Image } from './basic';
import { plugin } from '../config';

import {
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey
} from '../config';

const plugins = [plugin];

export default class extends Component {
  hasBlock = type => {
    const { value } = this.props;
    return value.blocks.some(node => node.type === type);
  };
  renderNode = props => {
    const { maxLimitKeys } = this.props;
    const { attributes, children, node, isFocused, editor } = props;
    const style = {};
    const isCurrentItem = plugin.utils
      .getItemsAtRange(editor.value)
      .contains(node);

    if (maxLimitKeys.findIndex(key => key === node.key) !== -1) {
      style.color = 'gray';
    }
    switch (node.type) {
      case 'block-quote':
        return (
          <blockquote {...attributes} style={style}>
            {children}
          </blockquote>
        );

      case 'bulleted-list':
        return (
          <ul {...attributes} style={style}>
            {children}
          </ul>
        );
      case 'heading-one':
        return (
          <h1 {...attributes} style={style}>
            {children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 {...attributes} style={style}>
            {children}
          </h2>
        );
      // case 'list-item':
      //   return (
      //     <li {...attributes} style={style}>
      //       {children}
      //     </li>
      //   );
      case 'ul_list':
        return (
          <ul {...attributes} style={style}>
            {children}
          </ul>
        );
      case 'ol_list':
        return (
          <ol {...attributes} style={style}>
            {children}
          </ol>
        );

      case 'list_item':
        return (
          <li
            className={isCurrentItem ? 'current-item' : ''}
            title={isCurrentItem ? 'Current Item' : ''}
            {...props.attributes}
            style={style}
          >
            {props.children}
          </li>
        );

      case 'image': {
        const src = node.data.get('src');
        return (
          <Image src={src} selected={isFocused} {...attributes} style={style} />
        );
      }
      case 'numbered-list':
        console.log('numbered');
        return (
          <ol {...attributes} style={style}>
            {children}
          </ol>
        );
      default:
        return <div style={style}>{children}</div>;
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

  onKeyDown = (event, change, editor: *) => {
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
  render() {
    return (
      <Editor
        style={{ height: '90vh', overflowY: 'auto' }}
        spellCheck
        autoFocus
        placeholder="Enter some text..."
        value={this.props.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        onDrop={this.onDropImage}
        plugins={plugins}
        shouldNodeComponentUpdate={props =>
          // To update the highlighting of nodes inside the selection
          props.node.type === 'list_item'
        }
      />
    );
  }
}
