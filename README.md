##############################################################################################################################################################################
-> Ubuntu error "/usr/bin/env: node: No such file or directory"
    Solution:

    Some linux distributions install nodejs not as "node" executable but as "nodejs".

    In this case you have to manually link to "node" as many packages are programmed after the "node" binary. Something similar also occurs with "python2" not linked to "python".

    In this case you can do an easy symlink. For linux distributions which install package binaries to /usr/bin you can do

    ln -s /usr/bin/nodejs /usr/bin/node

-> Error tone:

    "npm install tone"

########################################################################################################################################################################################
## scratch-vm
#### Scratch VM is a library for representing, running, and maintaining the state of computer programs written using [Scratch Blocks](https://github.com/LLK/scratch-blocks).

[![Build Status](https://travis-ci.org/LLK/scratch-vm.svg?branch=develop)](https://travis-ci.org/LLK/scratch-vm)
[![Dependency Status](https://david-dm.org/LLK/scratch-vm.svg)](https://david-dm.org/LLK/scratch-vm)
[![devDependency Status](https://david-dm.org/LLK/scratch-vm/dev-status.svg)](https://david-dm.org/LLK/scratch-vm#info=devDependencies)

## Installation
```bash
npm install https://github.com/LLK/scratch-vm.git
```

## Setup
For an extended setup example, check out the /playground directory, which includes a fully running VM instance.
```js
var VirtualMachine = require('scratch-vm');
var vm = new VirtualMachine();

// Block events
workspace.addChangeListener(vm.blockListener);
var flyoutWorkspace = workspace.toolbox_.flyout_.workspace_;
flyoutWorkspace.addChangeListener(vm.flyoutBlockListener);

// Run threads
vm.runtime.start();
```
## Development Server and Playground
For convenience, we've included a development server with the VM. This is useful because the VM can take advantage of executing in a WebWorker, which is not permitted in a local file. To start the server, run:

```bash
make serve
```
and go to [http://localhost:8080/](http://localhost:8080/) - you will be redirected to the playground, which demonstrates various tools and internal state.

![VM Playground Screenshot](https://i.imgur.com/nOCNqEc.gif)


## Standalone Build
```bash
make build
```

```html
<script src="/path/to/vm.js"></script>
<script>
    var vm = new window.VirtualMachine();
    // do things
</script>
```

## Abstract Syntax Tree

#### Overview
The Virtual Machine constructs and maintains the state of an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) by listening to events emitted by the [scratch-blocks](https://github.com/LLK/scratch-blocks) workspace via the `blockListener`. At any time, the current state of the AST can be viewed by inspecting the `vm.runtime.blocks` object.

#### Anatomy of a Block
```json
{
    "7AJZR#NA;m*b}R]pdq63": {
      "id": "7AJZR#NA;m*b}R]pdq63",
      "opcode": "control_wait",
      "inputs": {
        "DURATION": {
          "name": "DURATION",
          "block": ",xA8/S!Z6+kR,9dph.rO"
        }
      },
      "fields": {},
      "next": null,
      "topLevel": true
    },
    ",xA8/S!Z6+kR,9dph.rO": {
      "id": ",xA8/S!Z6+kR,9dph.rO",
      "opcode": "math_number",
      "inputs": {},
      "fields": {
        "NUM": {
          "name": "NUM",
          "value": "1"
        }
      },
      "next": null,
      "topLevel": false
    }
  }
```

## Testing
```bash
make test
```

```bash
make coverage
```

## Donate
We provide [Scratch](https://scratch.mit.edu) free of charge, and want to keep it that way! Please consider making a [donation](https://secure.donationpay.org/scratchfoundation/) to support our continued engineering, design, community, and resource development efforts. Donations of any size are appreciated. Thank you!
