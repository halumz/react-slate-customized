import { isKeyHotkey } from 'is-hotkey';
import { Block } from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';
import PluginEditList from './lib';

const DEFAULT_STORAGE_KEY = 'CustomizedSlate';
const DEFAULT_NODE = 'paragraph';
const MAX_LENGTH = 5;
const MAX_TAB_COUNT = 3;
const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');
const isTabHotKey = isKeyHotkey('tab');

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
const plugin = PluginEditList();

export {
  DEFAULT_STORAGE_KEY,
  DEFAULT_NODE,
  MAX_LENGTH,
  MAX_TAB_COUNT,
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey,
  isTabHotKey,
  schema,
  plugin
};
