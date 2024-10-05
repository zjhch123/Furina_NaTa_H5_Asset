var scene, camera, renderer, atlas, atlasLoader, animation = "0_stay";
var geometry, material, mesh, skeletonMesh;
var assetManager;
var canvas;
var lastFrameTime = Date.now() / 1000;

var baseUrl = "./";
var skeletonFile = "ff.json";
var atlasFile = "ff.atlas";

function init() {
	// create the THREE.JS camera, scene and renderer (WebGL)
	var width = window.innerWidth, height = window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000);
	camera.position.y = 0;
	camera.position.z = 400;
	scene = new THREE.Scene();
    scene.background = null;
	renderer = new THREE.WebGLRenderer({
        alpha: true
    });
	renderer.setSize(width, height);
    renderer.setClearAlpha(0);
	document.body.appendChild(renderer.domElement);
	canvas = renderer.domElement;

	// load the assets required to display the Raptor model
	assetManager = new spine.threejs.AssetManager(baseUrl);
	assetManager.loadText(skeletonFile);
	assetManager.loadTextureAtlas(atlasFile);

	requestAnimationFrame(load);
}

function load() {
	if (assetManager.isLoadingComplete()) {
		atlas = assetManager.get(atlasFile);

		// Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
		atlasLoader = new spine.AtlasAttachmentLoader(atlas);

		// Create a SkeletonJson instance for parsing the .json file.
		var skeletonJson = new spine.SkeletonJson(atlasLoader);

		// Set the scale to apply during parsing, parse the file, and create a new skeleton.
		skeletonJson.scale = 0.64;
		var skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile));

		// Create a SkeletonMesh from the data and attach it to the scene
		skeletonMesh = new spine.threejs.SkeletonMesh(skeletonData, function(parameters) {
			parameters.depthTest = false;
		});
		skeletonMesh.state.setAnimation(0, animation, true);
        scene.add(skeletonMesh);

		requestAnimationFrame(render);
	} else requestAnimationFrame(load);
}

function render() {
	// calculate delta time for animation purposes
	var now = Date.now() / 1000;
	var delta = now - lastFrameTime;
	lastFrameTime = now;

	// resize canvas to use full page, adjust camera/renderer
	resize();

	// rotate the cube

	// update the animation
	skeletonMesh.update(delta);

	// render the scene
	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

function resize() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	if (canvas.width != w || canvas.height != h) {
		canvas.width = w;
		canvas.height = h;
	}

	camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

init()
