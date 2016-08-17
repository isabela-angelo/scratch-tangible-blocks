


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
				console.log("saw a barcode marker with id", barcodeId);
				//console.log("teste: ", Object.getOwnPropertyNames(ev.data));
				console.log("position: ", ev.data.marker.pos);

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
					detectedBarcodeMarkers[barcodeId].matrix.set(transform);
					if (barcodeId == 9) { // INICIAL BLOCK
							xml = greenFlag_block;
	    		}
					if (detectedBarcodeMarkers[9]) {
						xml = xml.replace(/(<next>)<\//g,
	          '$1' + meow_block + '</');
						xml = '<xml xmlns="http://www.w3.org/1999/xhtml">' + xml + '</xml>';
						var dom = window.Blockly.Xml.textToDom(xml);
						window.Blockly.Xml.domToWorkspace(dom, workspace);
						console.log("teste");
					}
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

var meow_block = [
'  <block type="motion_movesteps">',
'    <value name="STEPS">',
'      <shadow type="math_number">',
'				<field name="NUM">10</field>',
'			 </shadow>',
'    </value>',
'    <next></next>',
'  </block>'
].join('\n');



var greenFlag_block = [
	'  <block type="event_whenflagclicked">',
	'    <next></next>',
	'  </block>'
].join('\n');

var code_to_block = {9:greenFlag_block, 20:meow_block};
var xml = "";

if (window.ARController && ARController.getUserMediaThreeScene) {

	ARThreeOnLoad();
}
