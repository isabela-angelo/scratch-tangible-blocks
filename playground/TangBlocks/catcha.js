
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
			if (barcodeId !== -1) {

				//console.log("teste: ", Object.getOwnPropertyNames(ev.data));


				// Note that you need to copy the values of the transformation matrix,
				// as the event transformation matrix is reused for each marker event
				// sent by an ARController.
				//
				var transform = ev.data.matrix;
				if (!detectedBarcodeMarkers[barcodeId]) {
					detectedBarcodeMarkers[barcodeId] = {
						visible: true,
						pos: [],
						matrix: new Float32Array(16)
					}
					detectedBarcodeMarkers[barcodeId].visible = true;
					detectedBarcodeMarkers[barcodeId].pos.push(ev.data.marker.pos);
					console.log("saw a barcode marker with id", barcodeId);
					console.log("position x: ", detectedBarcodeMarkers[barcodeId].pos[0]);
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					var toolbox = document.getElementById('toolbox');
	        var blocks = toolbox.getElementsByTagName('block');
	        var blockXML = blocks[code_to_block[barcodeId]];
	        var block = window.Blockly.Xml.domToBlock(blockXML, workspace);
	        block.initSvg();
					/*var interface_position = transformPosition(ev.data.marker.pos);
					block.moveBy(interface_position[0],interface_position[1]);
					if (barcodeId != 0) {
						var moveEvent = new window.Blockly.Events.fromJson({type: Blockly.Events.MOVE, blockId: block.id,
							newParentId: last_id}, workspace);
						moveEvent.run(true);
					}
					last_id = block.id;*/
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

var detectedBarcodeMarkers = {};
var last_id = "";

var greenFlag_block = 75;
var meow_block = 39;
var drum_block = 43;
var note_block = 46;

var code_to_block = {0:greenFlag_block, 1:meow_block, 2:drum_block, 3:note_block};
//var xml = "";

if (window.ARController && ARController.getUserMediaThreeScene) {

	ARThreeOnLoad();
}
