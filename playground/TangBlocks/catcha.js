var stop_reading = false;
var detectedBarcodeMarkers = {};
var codes_detected = [];
var last_codes_detected = [];
var old_ids = []

var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var echo_block = 49;
var no_effect_block = 51;



var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:echo_block, 4: no_effect_block};

invert_list_order = function(list) {
  var list_inverted = [];
  list_inverted.push(list[0]);
  for (var i = list.length - 1; i > 0; i--) {
    list_inverted.push(list[i]);
  }
  return list_inverted;
}

createBlocksInScratch = function() {
  if (old_ids.length != 0){
    var delete_blocks = new window.Blockly.Events.fromJson({type: Blockly.Events.DELETE,
      ids: old_ids}, workspace);
    delete_blocks.run(true);
    old_ids = [];
  }
  console.log("teste last_codes_detected ", last_codes_detected);
  last_codes_detected = invert_list_order(last_codes_detected);
	var last_id = "";
	var codes = last_codes_detected;
	console.log("teste codes ", codes);
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
      moveEvent.run(true);
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
			var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
			var h = window.innerWidth;
			//renderer.setSize(w, h);
			renderer.domElement.style.paddingBottom = (w-h) + 'px';
		} else {
			if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
				//renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
			} else {
				//renderer.setSize(arController.videoWidth, arController.videoHeight);
				document.body.className += ' desktop';
			}
		}
		renderer.domElement.style.visibility = "hidden";
		renderer.setSize(0, 0);

		document.body.insertBefore(renderer.domElement, document.body.firstChild);



		arController.addEventListener('getMarker', function(ev) {
			var barcodeId = ev.data.marker.idMatrix;
			if (barcodeId !== -1 && stop_reading == false) {




				/* Note:
				- Equal blocks are not recognized (just one of them)
				- Blocks need to be organized before running the script so the blocks will be placed right in the Scratch Script
				*/
				var transform = ev.data.matrix;
				if (!detectedBarcodeMarkers[barcodeId]) {
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
					detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					//console.log("saw a barcode marker with id", barcodeId);
					//console.log("position x: ", detectedBarcodeMarkers[barcodeId].pos[0]);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					codes_detected.push(barcodeId);

					/*var interface_position = transformPosition(ev.data.marker.pos);
					block.moveBy(interface_position[0],interface_position[1]);
					if (barcodeId != 0) {
						var moveEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.MOVE, blockId: block.id,
							newParentId: last_id}, workspace);
						moveEvent.run(true);
					}
					last_id = block.id;*/
				}
				if (detectedBarcodeMarkers[0] && barcodeId == 0) {
					//console.log("teste codes_detected ", codes_detected);
					detectedBarcodeMarkers = {};
					//console.log("teste detectedBarcodeMarkers ", detectedBarcodeMarkers);
          last_codes_detected = codes_detected;
					codes_detected = [];
					//console.log("teste codes_detected ", codes_detected);
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
					detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					//console.log("saw a barcode marker with id", barcodeId);
					//console.log("position x: ", detectedBarcodeMarkers[barcodeId].pos[0]);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					codes_detected.push(barcodeId);
					//console.log("teste detectedBarcodeMarkers ", detectedBarcodeMarkers);
					//console.log("teste codes_detected ", codes_detected);
				}

			}
		});

		var tick = function() {
			arScene.process();

			arScene.renderOn(renderer);
			requestAnimationFrame(tick);
			//console.log(detectedBarcodeMarkers);

		};

		tick();

	}});

	delete window.ARThreeOnLoad;

};

//var xml = "";

if (window.ARController && ARController.getUserMediaThreeScene) {

	ARThreeOnLoad();
}
