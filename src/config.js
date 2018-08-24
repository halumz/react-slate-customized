import { isKeyHotkey } from 'is-hotkey';
import { Block } from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';

const DEFAULT_STORAGE_KEY = 'CustomizedSlate';
const DEFAULT_NODE = 'paragraph';
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

export {
  DEFAULT_STORAGE_KEY,
  DEFAULT_NODE,
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey,
  isTabHotKey,
  schema
};
