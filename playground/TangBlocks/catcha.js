
var stop_reading = false; //when the system is creating the blocks in Scratch, the reading of the codes stops
var detectedBarcodeMarkers = {};  //detected codes and its attributes
var codes_detected = []; // an array of the detected codes numbers
var last_codes_detected = []; // an array of the last detected codes numbers
var old_ids = []; // ids of the blocks that was created in Scratch last time
var par_list = []; // parameters of funtions (like numbers, strings...)

// numbers of the blocks in Scratch
var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var play_pith = 41;
var wait = 83;
var repeat = 84;
var end_repeat = 84.5;
var green_flag_button = 0.5;

// codes and blocks or parameters in Scratch
var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:play_pith,
  4: wait, 5: repeat, 6: end_repeat, 7: "1", 8: "meow", 9: "10", 63: green_flag_button};

// code 4 -> green flag button TO TEST!
var green_flag_count = 0;

// play the info of the new blocks in the script
check_new_blocks = function(list, last_list) {
  if (last_list.length < list.length) {
    for (var i = 0; i <last_list.length; i++) {
      if (list[i] != last_list[i]) {
        //console.log("play sound ", list[i]);
        return;
      }
    }
    //console.log("play sound ", list[list.length-1]);
    //play the sound of the last block in list
  }
}


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

invert_list_order = function(list) {
  var list_inverted = [];
  list_inverted.push(list[0]);
  for (var i = list.length - 1; i > 0; i--) {
    list_inverted.push(list[i]);
  }
  return list_inverted;
}

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
  var codes = invert_list_order(last_codes_detected);
	var last_id = ""; // save the last block id created in Scratch so it can be used to connect to the next one

  //codes = [0, 1, 5, 1, 2, 6, 2];
  console.log("teste codes ", codes);
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
  		block.initSvg();
      old_ids.push(block.id);

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
transformPosition = function(position) {

	return  new_position;
}

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

      // ckeck green flag "button" - some seconds hiding the block and the code run
      if (last_codes_detected.length > 0) {
        if (last_codes_detected.indexOf(63) == -1 && green_flag_count < 700) {
          green_flag_count ++;
        }
        else {
          green_flag_count = 0;
        }
        if (green_flag_count == 500) {
          stop_reading = true;
          createBlocksInScratch();
        }
        if (green_flag_count == 700) {          
          console.log("stop_reading ", stop_reading);
          window.vm.greenFlag();  // green flag "pressed"
        }
      }

			var barcodeId = ev.data.marker.idMatrix;
			if (barcodeId !== -1 && stop_reading == false) {
				var transform = ev.data.matrix;
				if (!detectedBarcodeMarkers[barcodeId]) {
          // if the code is for a parameter, put it in the parameters list
          if (barcodeId < 7 || barcodeId == 63) {
  					detectedBarcodeMarkers[barcodeId] = {
  						visible: true,
  						pos: [],
  						matrix: new Float32Array(16)
  					}
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
            // probably the parameter order in the list is the parameter order to put in the function list TEST IT!
            //var pos_test = getPosition(ev.data.marker.pos);
            par_list.push(code_to_block[barcodeId]);

          }
				}
        else {
          if (checkBlock(detectedBarcodeMarkers[barcodeId].pos, getPosition(ev.data.marker.pos)) == -1) {
          //if the barcode detected was not added to the list, add it
              detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
              //console.log("again saw a barcode marker with id", barcodeId);
    					//console.log("position : ", detectedBarcodeMarkers[barcodeId].pos[1]);
              detectedBarcodeMarkers[barcodeId].visible = true;
              detectedBarcodeMarkers[barcodeId].matrix.set(transform);
    					codes_detected.push(barcodeId);
          }
        }
        // restart the list with the first block, the green flag
				if (detectedBarcodeMarkers[0] && barcodeId == 0) {
					detectedBarcodeMarkers = {};
          check_new_blocks(codes_detected, last_codes_detected);
          last_codes_detected = codes_detected;
					codes_detected = [];
          par_list = [];
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
