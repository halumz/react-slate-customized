// @flow
import { Block, type Change } from 'slate';
import { MAX_TAB_COUNT } from '../../config';

import type Options from '../options';
import {
  getPreviousItem,
  getCurrentItem,
  getListForItem,
  isList
} from '../utils';

/**
 * Increase the depth of the current item by putting it in a sub-list
 * of previous item.
 * For first items in a list, does nothing.
 */
function increaseItemDepth(opts: Options, change: Change): Change {
  const previousItem = getPreviousItem(opts, change.value);
  const currentItem = getCurrentItem(opts, change.value);

  if (!previousItem) {
    return change;
  }

  if (!currentItem) {
    return change;
  }

  // Move the item in the sublist of previous item
  return moveAsSubItem(opts, change, currentItem, previousItem.key);
}

/**
 * Move the given item to the sublist at the end of destination item,
 * creating a sublist if needed.
 */
function moveAsSubItem(
  opts: Options,
  change: Change,
  // The list item to add
  item: Block,
  // The key of the destination node
  destKey: string
): Change {
  const destination = change.value.document.getDescendant(destKey);
  const lastIndex = destination.nodes.size;
  const lastChild = destination.nodes.last();

  // The potential existing last child list
  const existingList = isList(opts, lastChild) ? lastChild : null;

  //max tab count
  if (change.value.document.getDepth(destKey) > 2 * MAX_TAB_COUNT - 1) {
    return;
  }
  if (existingList) {
    return change.moveNodeByKey(
      item.key,
      existingList.key,
      existingList.nodes.size // as last item
    );
  }
  const currentList = getListForItem(opts, change.value, destination);
  if (!currentList) {
    return;
  }
  const newSublist = Block.create({
    object: 'block',
    type: currentList.type,
    data: currentList.data
  });

  change.insertNodeByKey(destKey, lastIndex, newSublist, {
    normalize: false
  });

  return change.moveNodeByKey(item.key, newSublist.key, 0);
}

export default increaseItemDepth;
