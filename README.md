# react-slate-customized

[![NPM version](https://badge.fury.io/js/slate-edit-list.svg)](http://badge.fury.io/js/slate-edit-list)
[![Linux Build Status](https://travis-ci.org/GitbookIO/slate-edit-list.png?branch=master)](https://travis-ci.org/GitbookIO/slate-edit-list)

A Slate example to improvise the editor using [react](https://github.com/facebook/create-react-app) and [Slate](https://www.slatejs.org/#/rich-text)

[Demo Link](https://halumz.github.io/react-slate-customized)

## Features

An enhanced standard rich text using [Slate](https://www.slatejs.org/#/rich-text)

* Images:

  * Image linking from url
  * Image upload with button drop desktop using [dropzone](https://github.com/enyo/dropzone)

* Lists:
  Ordered and unordered lists with tab support using [slate-edit-list](https://github.com/GitbookIO/slate-edit-list)

  * Pressing <kbd>Enter</kbd> insert a new list item
  * Pressing <kbd>Shift+Enter</kbd> split the block in the list item
  * Pressing <kbd>Tab</kbd> increase the depth of the item (creates a sub-list)
  * Pressing <kbd>Shift+Tab</kbd> decrease the depth of the item
  * Pressing <kbd>Delete</kbd> (OSX) or <kbd>Backspace</kbd> at the start, remove the list item (or the list)

* Save/Cancel functionality
  * Save - stores new editor content in `localstorage` included image path
  * Cancel - restores to the old saved content from `localstorage`
* Number of top-level block is restricted in [config->MAX_LENGTH](https://github.com/halumz/react-slate-customized/blob/master/src/config.js#L8) file
