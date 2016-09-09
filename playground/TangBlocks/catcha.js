
var stop_reading = false; //when the system is creating the blocks in Scratch, the reading of the codes stops
var detectedBarcodeMarkers = {};  //detected codes and its attributes
var codes_detected = []; // an array of the detected codes numbers
var last_codes_detected = []; // an array of the last detected codes numbers
var old_ids = [] // ids of the blocks that was created in Scratch last time


// numbers of the blocks in Scratch
var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var echo_block = 49;
var no_effect_block = 51;

// codes and blocks in Scratch
var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:echo_block, 4: no_effect_block};

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
  pos_2[0] = parseInt(pos[0].toFixed(2));
  pos_2[1] = parseInt(pos[1].toFixed(2));
  return pos_2;
}

// method to create the blocks in Scratch
createBlocksInScratch = function() {


	// loop to delete the blocks that are in Scratch Script
  if (old_ids.length != 0){
    var delete_blocks = new window.Blockly.Events.fromJson({type: Blockly.Events.DELETE,
      ids: old_ids}, workspace);
    delete_blocks.run(true);
    old_ids = [];
  }
  console.log("teste last_codes_detected ", last_codes_detected);
  last_codes_detected = invert_list_order(last_codes_detected);
	var last_id = ""; // save the last block id created in Scratch so it can be used to connect to the next one
	var codes = last_codes_detected;

	console.log("teste codes ", codes);
	// loop to create the blocks and connect them
	for (var i = 0; i < codes.length; i++) {
		var toolbox = document.getElementById('toolbox');
		var blocks = toolbox.getElementsByTagName('block');
		var blockXML = blocks[code_to_block[codes[i]]];
		var block = window.Blockly.Xml.domToBlock(blockXML, workspace);
		block.initSvg();
    old_ids.push(block.id);

		if (last_id.localeCompare("") != 0) {
			child_id = block.id;
			parent_id = last_id;
			var moveEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.MOVE, blockId: child_id,
				newParentId: parent_id}, workspace);

      moveEvent.run(true); // Event to connect the blocks

		}
		last_id = block.id;
	}
	stop_reading = false;
  old_codes = codes_detected;
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
			var barcodeId = ev.data.marker.idMatrix;
			if (barcodeId !== -1 && stop_reading == false) {
				var transform = ev.data.matrix;
				if (!detectedBarcodeMarkers[barcodeId]) {
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
          detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
					//detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					//console.log("saw a barcode marker with id", barcodeId);
					//console.log("position x: ", detectedBarcodeMarkers[barcodeId].pos[0]);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					codes_detected.push(barcodeId);
				}
        else {
          if (checkBlock(detectedBarcodeMarkers[barcodeId].pos, getPosition(ev.data.marker.pos)) == -1) {
              detectedBarcodeMarkers[barcodeId].pos.push(getPosition(ev.data.marker.pos));
              console.log("pos ", detectedBarcodeMarkers[barcodeId].pos[1]);
              detectedBarcodeMarkers[barcodeId].visible = true;
              detectedBarcodeMarkers[barcodeId].matrix.set(transform);
    					codes_detected.push(barcodeId);
          }
        }
				if (detectedBarcodeMarkers[0] && barcodeId == 0) {
					detectedBarcodeMarkers = {};
          last_codes_detected = codes_detected;
					codes_detected = [];
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
