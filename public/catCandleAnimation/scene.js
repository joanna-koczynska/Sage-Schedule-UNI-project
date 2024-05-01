console.log("a teraz tu")



var threeScript = document.createElement('script');
threeScript.src = '/js/three.js';
document.head.appendChild(threeScript);

var ddsLoaderScript = document.createElement('script');
ddsLoaderScript.src = '/js/loaders/DDSLoader.js';
document.head.appendChild(ddsLoaderScript);

var mtLoaderScript = document.createElement('script');
mtLoaderScript.src = '/js/loaders/MTLLoader.js';
document.head.appendChild(mtLoaderScript);

var objMtLoaderScript = document.createElement('script');
objMtLoaderScript.src = '/js/loaders/OBJMTLLoader.js';
document.head.appendChild(objMtLoaderScript);

var detectorScript = document.createElement('script');
detectorScript.src = '/js/Detector.js';
document.head.appendChild(detectorScript);


	var camera, scene, renderer;
	var windowHalfX = window.innerWidth;
	var windowHalfY = window.innerHeight;

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 20, 4096);
	camera.position.set(0, 500, 1700); 
	camera.lookAt(new THREE.Vector3(-500, 400, 100));
	camera.castShadow = true;

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x26372C);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	document.body.appendChild(renderer.domElement);

	// scene 
	var deskTex = THREE.ImageUtils.loadTexture('project/O5GLL70.jpg'); 
	deskTex.wrapS = THREE.RepeatWrapping; 
	deskTex.wrapT = THREE.RepeatWrapping;
	deskTex.anisotropy = 16;

	var DeskMaterial = new THREE.MeshBasicMaterial({ map: deskTex });
	var DeskGeometry = new THREE.CubeGeometry(2500, 100, 800);
	var desk = new THREE.Mesh(DeskGeometry, DeskMaterial);
	desk.position.x = -350;
	desk.position.y = -100;
	desk.position.z = 500;
	scene.add(desk);


	//window
	var cityTex = THREE.ImageUtils.loadTexture('project/sky2.jpg'); 
	cityTex.wrapS = THREE.RepeatWrapping;
	cityTex.wrapT = THREE.RepeatWrapping;
	cityTex.anisotropy = 16;

	var cityMaterial = new THREE.MeshPhongMaterial({ map: cityTex });
	var cityGeometry = new THREE.CubeGeometry(1890, 2000, 8);
	var city = new THREE.Mesh(cityGeometry, cityMaterial);
	city.position.x = -455;
	city.position.y = 700;
	city.position.z = -500;
	scene.add(city);


	//poster
	var posterTex = THREE.ImageUtils.loadTexture('project/wave.jpg');
	posterTex.wrapS = THREE.RepeatWrapping; 
	posterTex.wrapT = THREE.RepeatWrapping;
	posterTex.anisotropy = 16;

	var posterMaterial = new THREE.MeshPhongMaterial({ map: posterTex });
	var posterGeometry = new THREE.CubeGeometry(8, 1024, 800);
	var poster = new THREE.Mesh(posterGeometry, posterMaterial);
	poster.position.x = -1900;
	poster.position.y = 700;
	poster.position.z = 300;
	scene.add(poster);


	//left wall
	var wallTex = THREE.ImageUtils.loadTexture('project/green.jpg');
	wallTex.wrapS = THREE.RepeatWrapping;
	wallTex.wrapT = THREE.RepeatWrapping;

	var wallMaterial = new THREE.MeshPhongMaterial({ map: wallTex });
	var wallGeometry = new THREE.CubeGeometry(100, 2500, 2000);
	var wall = new THREE.Mesh(wallGeometry, wallMaterial);
	wall.position.x = -2500;
	wall.position.y = 500;
	wall.position.z = 250;
	scene.add(wall);


	//lights
	var directionalLight = new THREE.DirectionalLight(0xe0ae63, 0.5);
	directionalLight.castShadow = true;
	directionalLight.position.set(10, 800, -300);
	directionalLight.shadowCameraNear = 1;
	directionalLight.shadowCameraFar = 800;
	directionalLight.shadowCameraRight = 150;
	directionalLight.shadowCameraLeft = -60;
	directionalLight.shadowCameraTop = 100;
	directionalLight.shadowCameraBottom = -100;
	//directionalLight.shadowCameraVisible = true;  //schemat oddzialywania swiatla
	scene.add(directionalLight);

	scene.add(new THREE.AmbientLight(0xa89b83));

	var sun = new THREE.PointLight(0xe0ae63, 0.15);
	sun.position.set(10, 800, -300);
	scene.add(sun);


	// objects

	var onProgress = function (xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}
	};

	var onError = function (xhr) {
	};


	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

	//cat
	var loader = new THREE.OBJMTLLoader();
	loader.load('project/cat/cat.obj', 'project/cat/cat.mtl', function (cat) {
		cat.position.x = -1300;
		cat.position.y = -100;
		cat.position.z = 100;
		cat.castShadow = true;
		cat.receiveShadow = false;
		scene.add(cat);
	}, onProgress, onError);

	//candle
	var loader = new THREE.OBJMTLLoader();
	loader.load('project/candle/candle.obj', 'project/candle/candle.mtl', function (candle) {
		candle.position.x = 0;
		candle.position.y = 0;
		candle.position.z = 200;
		candle.castShadow = false;
		candle.receiveShadow = true;
		scene.add(candle);
	}, onProgress, onError);


	//window frames
	var loader = new THREE.OBJMTLLoader();
	loader.load('project/Window/Window.obj', 'project/Window/Window.mtl', function (frames) {
		frames.position.x = -900;
		frames.position.y = -38;
		frames.position.z = 0;
		scene.add(frames);
	}, onProgress, onError);

	//plant
	var loader = new THREE.OBJMTLLoader();
	loader.load('project/plant/model.obj', 'project/plant/model.mtl', function (plant) {
		plant.position.x = 350;
		plant.position.y = -30;
		plant.position.z = 150;
		scene.add(plant);
	}, onProgress, onError);

	
	//flames
	var geometry = new THREE.Geometry();

	geometry.vertices.push(new THREE.Vector3(-6.5, -6.5, -6.5));
	geometry.vertices.push(new THREE.Vector3(-6.5, -6.5, 6.5));
	geometry.vertices.push(new THREE.Vector3(6.5, -6.5, 6.5));
	geometry.vertices.push(new THREE.Vector3(6.5, -6.5, -6.5));
	geometry.vertices.push(new THREE.Vector3(0, 25, 0));

	geometry.faces.push(new THREE.Face3(0, 1, 4));	
	geometry.faces.push(new THREE.Face3(1, 2, 4));
	geometry.faces.push(new THREE.Face3(2, 3, 4));
	geometry.faces.push(new THREE.Face3(3, 0, 4));

	var textures = ['project/flame.jpg'];
	var materials = [];

	for (var i = 0; i < textures.length; i++) {
		var texture = THREE.ImageUtils.loadTexture(textures[i]);
		texture.anisotropy = renderer.getMaxAnisotropy();
		materials.push(new THREE.MeshBasicMaterial({ map: texture }));
	}

	var flameTex = THREE.ImageUtils.loadTexture('project/flame.jpg');
	flameTex.wrapS = THREE.RepeatWrapping;
	flameTex.wrapT = THREE.RepeatWrapping;

	geometry.faceVertexUvs[0] = [];

	geometry.faceVertexUvs[0][0] = [new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.5, 0.5)];
	geometry.faceVertexUvs[0][1] = [new THREE.Vector2(0.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.5)];

	geometry.faceVertexUvs[0][2] = [new THREE.Vector2(0, 0.5), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 1)];
	geometry.faceVertexUvs[0][3] = [new THREE.Vector2(0.5, 0.5), new THREE.Vector2(1, 0.5), new THREE.Vector2(1, 1)];



	pyramid1 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
	pyramid1.position.set(115, 170, 370)
	scene.add(pyramid1);
	pyramid1.visible = false;

	pyramid2 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
	pyramid2.position.set(223, 170, 370)
	scene.add(pyramid2);
	pyramid2.visible = false;

	pyramid3 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
	pyramid3.position.set(168, 170, 285)
	scene.add(pyramid3);
	pyramid3.visible = false;



	//flame point light
	var flame1, flame2, flame3;
	var sphere = new THREE.SphereGeometry(8, 8, 8);

	var lightSphereMesh1 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ map: flameTex }));
	lightSphereMesh1.visible = false;

	var lightSphereMesh2 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ map: flameTex }));
	lightSphereMesh2.visible = false;

	var lightSphereMesh3 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ map: flameTex }));
	lightSphereMesh3.visible = false;

	flame1 = new THREE.PointLight(0xffa200, 0, 300);
	flame1.position.set(115, 165, 370)
	flame1.castShadow = true;


	flame2 = new THREE.PointLight(0xffa200, 0, 300);
	flame2.position.set(223, 165, 370)
	flame2.castShadow = true;


	flame3 = new THREE.PointLight(0xffa200, 0, 300);
	flame3.position.set(168, 165, 285)
	flame3.castShadow = true;

	scene.add(flame1);
	scene.add(flame2);
	scene.add(flame3);


	flame1.add(lightSphereMesh1);
	flame2.add(lightSphereMesh2);
	flame3.add(lightSphereMesh3);

	function toggleLight() {
		flame1.intensity = (flame1.intensity == 0) ? 0.3 : 0;
		flame2.intensity = (flame2.intensity == 0) ? 0.3 : 0;
		flame3.intensity = (flame3.intensity == 0) ? 0.3 : 0;

		lightSphereMesh1.visible = !lightSphereMesh1.visible;
		lightSphereMesh2.visible = !lightSphereMesh2.visible;
		lightSphereMesh3.visible = !lightSphereMesh3.visible;

		pyramid1.visible = !pyramid1.visible;
		pyramid2.visible = !pyramid2.visible;
		pyramid3.visible = !pyramid3.visible;
	}



	var kat = 0;
	function render() {
		requestAnimationFrame(render);
		kat -= delta;
		camera.position.x = Math.sin(kat) * 200;

		pyramid1.rotation.y += 0.01;
		pyramid2.rotation.y += 0.01;
		pyramid3.rotation.y += 0.01;

		renderer.render(scene, camera);
	}
	render();

