var stop_reading = false;  //when the system is creating the blocks in Scratch, the reading of the codes stops
var detectedBarcodeMarkers = {}; //detected codes and its attributes
var codes_detected = []; // an array of the detected codes numbers

var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var echo_block = 49;
var no_effect_block = 51;



var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:echo_block, 4: no_effect_block};


// method to create the blocks in Scratch
createBlocksInScratch = function() {

	var last_id = ""; // save the last block id created in Scratch so it can be used to connect to the next one
	var codes = codes_detected;
	console.log("teste codes ", codes);
	// loop to create the blocks and connect them
	for (var i = 0; i < codes.length; i++) {
		var toolbox = document.getElementById('toolbox');
		var blocks = toolbox.getElementsByTagName('block');
		var blockXML = blocks[code_to_block[codes[i]]];
		var block = window.Blockly.Xml.domToBlock(blockXML, workspace);
		block.initSvg();

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
					detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					//console.log("saw a barcode marker with id", barcodeId);
					//console.log("position x: ", detectedBarcodeMarkers[barcodeId].pos[0]);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					codes_detected.push(barcodeId);
				}
				if (detectedBarcodeMarkers[0] && barcodeId == 0) {
					detectedBarcodeMarkers = {};
					codes_detected = [];
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
					detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
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
