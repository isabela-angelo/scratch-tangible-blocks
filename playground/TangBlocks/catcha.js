
var stop_reading = false; //when the system is creating the blocks in Scratch, the reading of the codes stops
var detectedBarcodeMarkers = {};  //detected codes and its attributes
var codes_detected = []; // an array of the detected codes numbers
var last_codes_detected = []; // an array of the last detected codes numbers
var old_ids = []; // ids of the blocks that was created in Scratch last time
var par_list = [];
var par_list_last = []; // parameters of funtions (like numbers, strings...)

// numbers of the blocks in Scratch
var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var play_pith = 41;
var wait = 83;
var repeat = 84;
var end_repeat = 84.5;

// codes and blocks or parameters in Scratch
var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:play_pith,
  4: wait, 5: repeat, 6: end_repeat,
  10: 0, 11: 1, 12: 2, 13: 3, 14: 4, 15: 5, 16: 6, 17: 7, 18: 8, 19: 9,20: 10};

// check if the block regognized has already been added to the codes_detected list
checkBlock = function(list, item) {
  var obj;
  for (i = 0; i<list.length; i++) {
    if (list[i][0] == item[0] && list[i][1] == item[1]) {
      return 1;
    }
  }
  return -1; // the block is not in the list
}

// the recognition of the barcodes from the videos starts in the end of the image in the frame
//so the list of codes recognized needs to be inverted
invert_list_order = function(list) {
  var list_inverted = [];
  if (list[0] == 0) { // if the list starts with 0 (the green flag block) just invert the order of the other blocks
    list_inverted.push(list[0]); // start with zero (green flag block)
    for (var i = list.length - 1; i > 0; i--) {
      list_inverted.push(list[i]);
    }
  }
  else {
    for (var i = list.length - 1; i >= 0; i--) {
      list_inverted.push(list[i]);
    }
  }

  //console.log("teste list_inverted ", list_inverted);

  return list_inverted;
}


//get the position of the barcodes with two decimal numbers
getPosition = function(pos) {
  var pos_2 = [];
  pos_2[0] = parseFloat(pos[0].toFixed(2));
  pos_2[1] = parseFloat(pos[1].toFixed(2));
  return pos_2;
}

// method to create the blocks in Scratch
createBlocksInScratch = function() {
  var flag_end_repeat = false;  //flag to put the next block outside the repeat
  var last_repeat_id = ""; // block id of the last repeat found
	// loop to delete the blocks that are in Scratch Script
  if (old_ids.length != 0){
    var delete_blocks = new window.Blockly.Events.fromJson({type: Blockly.Events.DELETE,
      ids: old_ids}, workspace);
    delete_blocks.run(true);
    old_ids = [];
  }
  console.log("teste last_codes_detected ", last_codes_detected);
  console.log("teste par_list_last ", par_list_last);
  var codes = invert_list_order(last_codes_detected);
  var pars = invert_list_order(par_list_last);
	var last_id = ""; // save the last block id created in Scratch so it can be used to connect to the next one

  // DEBUG!!!
  //codes = [0, 5, 1, 6];
  //pars = [12, 13];


  console.log("teste codes ", codes);
  console.log("teste pars ", pars);
	// loop to create the blocks and connect them
	for (var i = 0; i < codes.length; i++) {
    if (code_to_block[codes[i]] == 84.5) {
      flag_end_repeat = true; // the next block will be outside the repeat
    }
    else if (code_to_block[codes[i]] != 0.5){
  		var toolbox = document.getElementById('toolbox');
  		var blocks = toolbox.getElementsByTagName('block');
  		var blockXML = blocks[code_to_block[codes[i]]];
  		var block = window.Blockly.Xml.domToBlock(blockXML, workspace);

      //if (code_to_block[codes[i]] == 84) {
        //console.log("lalal ", Object.getOwnPropertyNames(block));
        //console.log(block);
        //console.log(block.childBlocks_[0]);
      //}

  		block.initSvg();
      old_ids.push(block.id);

      //console.log ("id:", block.id)

      //add the parameter to wait block
      if (code_to_block[codes[i]] == 83) {
        var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
                element: "field", name: "NUM", newValue: code_to_block[pars.shift()]}, workspace);
        changeEvent.run(true); // Event to change parameter
      }
      //add the parameter to play sound block
      if (code_to_block[codes[i]] == 39) {
        // something is wrong with the change event in dropdown menus (error when the block is  deleted)
        // for now: no dropdown menus in blocks -> it is a number input area
        // var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
        //         element: "field", name: "SOUND_MENU", newValue: code_to_block[pars.shift()]}, workspace);
        // changeEvent.run(true); // Event to change parameter
        var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
                element: "field", name: "NUM", newValue: code_to_block[pars.shift()]}, workspace);
        changeEvent.run(true); // Event to change parameter
      }
      //add the parameter to play drum block
      if (code_to_block[codes[i]] == 43) {
        var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
                element: "field", name: "NUM", newValue: code_to_block[pars.shift()]+1}, workspace);
        changeEvent.run(true); // Event to change parameter
      }
      //add the parameter to play sound with pitch block
      if (code_to_block[codes[i]] == 41) {
        var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
                element: "field", name: "SOUND_MENU", newValue: code_to_block[pars.shift()]}, workspace);
        changeEvent.run(true); // Event to change parameter
        changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[1].id,
                element: "field", name: "NUM", newValue: code_to_block[pars.shift()]}, workspace);
        changeEvent.run(true); // Event to change parameter
      }
      //add the parameter to repeat block
      if (code_to_block[codes[i]] == 84) {
        var changeEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.CHANGE, blockId: block.childBlocks_[0].id,
                element: "field", name: "NUM", newValue: code_to_block[pars.shift()]}, workspace);
        changeEvent.run(true); // Event to change parameter
      }

  		if (last_id.localeCompare("") != 0) {
  			child_id = block.id;
  			parent_id = last_id;
        if (code_to_block[codes[i-1]] != null && code_to_block[codes[i-1]] == 84) { // if last block was a loop
          last_repeat_id = last_id; // save id
          var moveEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.MOVE, blockId: child_id,
                   newParentId: parent_id, newInputName: "SUBSTACK"}, workspace);
          moveEvent.run(true); // Event to connect the blocks

        }
        else {
          if (flag_end_repeat) {
            flag_end_repeat = false;
            parent_id = last_repeat_id;
          }
          var moveEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.MOVE, blockId: child_id,
                   newParentId: parent_id}, workspace);
          moveEvent.run(true); // Event to connect the blocks
        }

  		}
  		last_id = block.id;
    }
	}
  old_codes = codes_detected;
  stop_reading = false;

}

// when the spcabar is pressed the blocks are created in Scratch and then the code runs
document.addEventListener('keydown', function (e) {
  if(e.keyCode == 32) {
    console.log("space key");
    stop_reading = true;
    var createBlocks = new Promise(function(resolve) {
          createBlocksInScratch();
          setTimeout(function() {
              resolve();
          }, (1000 * 5) );
    });
    createBlocks.then(function() {
      window.vm.greenFlag();
    });
    e.preventDefault();
  }
});

window.ARThreeOnLoad = function() {

	ARController.getUserMediaThreeScene({maxARVideoSize: 320, cameraParam: 'Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
	onSuccess: function(arScene, arController, arCamera) {

		arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

		document.body.className = arController.orientation;

		var renderer = new THREE.WebGLRenderer({antialias: true});
		if (arController.orientation === 'portrait') {
			//var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
			//var h = window.innerWidth;
			//renderer.setSize(w, h);
			//renderer.domElement.style.paddingBottom = (w-h) + 'px';
		} else {
			if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
				//renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
			} else {
				renderer.setSize(arController.videoWidth, arController.videoHeight);
				document.body.className += ' desktop';
			}
		}
		renderer.domElement.style.visibility = "hidden";
		renderer.setSize(0, 0);

		document.body.insertBefore(renderer.domElement, document.body.firstChild);


		arController.addEventListener('getMarker', function(ev) { // event that a marker was recognized

      var barcodeId = ev.data.marker.idMatrix;
			if (barcodeId !== -1 && stop_reading == false) {
				var transform = ev.data.matrix;
				if (!detectedBarcodeMarkers[barcodeId]) {
          detectedBarcodeMarkers[barcodeId] = {
            visible: true,
            pos: [],
            matrix: new Float32Array(16)
          }
          // if the code is not for a parameter, put it in the codes_detected list
          if (barcodeId < 7 || barcodeId == 63) {
  					detectedBarcodeMarkers[barcodeId].visible = true;
            detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
  					//detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);

  					//console.log("saw a barcode marker with id", barcodeId);
  					//console.log("position : ", detectedBarcodeMarkers[barcodeId].pos[0]);

  					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
  					codes_detected.push(barcodeId);
          }

          else {
            //set the parameter to the method (pos of parameter is (x + w, y) the position of the method (x, y))
            //the parameter order in the list is the parameter order to put in the function list (in this specific prototype)

            //var pos_test = getPosition(ev.data.marker.pos);
            //console.log("saw a barcode marker with id", barcodeId);

            detectedBarcodeMarkers[barcodeId].visible = true;
            detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
            par_list.push(barcodeId);

          }
				}
        else {
          if (checkBlock(detectedBarcodeMarkers[barcodeId].pos, getPosition(ev.data.marker.pos)) == -1) {
          //if the barcode detected was not added to the list, add it
            if (barcodeId < 7 || barcodeId == 63) {
              // if the code is not for a parameter, put it in the codes_detected list
              detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));

              //console.log("again saw a barcode marker with id", barcodeId);
    					//console.log("position : ", detectedBarcodeMarkers[barcodeId].pos[1]);

              detectedBarcodeMarkers[barcodeId].visible = true;
              detectedBarcodeMarkers[barcodeId].matrix.set(transform);
    					codes_detected.push(barcodeId);
            }
            //if the code is for a parameter, put it in the par_list list
            else {

              //console.log("saw a barcode marker with id", barcodeId);

              detectedBarcodeMarkers[barcodeId].visible = true;
              detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
              par_list.push(barcodeId);
            }
          }
        }
        // restart the list with the first block: the green flag
				if (detectedBarcodeMarkers[0] && barcodeId == 0) {
					detectedBarcodeMarkers = {};
          //check_new_blocks(codes_detected, last_codes_detected);
          last_codes_detected = codes_detected;
					codes_detected = [];

          //console.log("par_list : ", par_list);

          par_list_last = par_list;
          par_list = [];

          //add the green flag - 0 - in the list again
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
          detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
					//detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					codes_detected.push(barcodeId);
				}
        //console.log("fim!!!!");
			}
		});
		var tick = function() {
			arScene.process();
			arScene.renderOn(renderer);
			requestAnimationFrame(tick);
		};
		tick();
	}});
	delete window.ARThreeOnLoad;
};

if (window.ARController && ARController.getUserMediaThreeScene) {
	ARThreeOnLoad();
}
