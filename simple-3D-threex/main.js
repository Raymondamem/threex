var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true

var onRenderFcts = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);

camera.position.z = -2;

var light = new THREE.AmbientLight(0x222222, 100)
scene.add(light)

var light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5, 5, -5)
scene.add(light)
light.castShadow = true
light.shadowCameraNear = 0.01
light.shadowCameraFar = 15
light.shadowCameraFov = 45

light.shadowCameraLeft = -1
light.shadowCameraRight = 1
light.shadowCameraTop = 1
light.shadowCameraBottom = -1
// light.shadowCameraVisible	= true

light.shadowBias = 0.001
light.shadowDarkness = 0.2

light.shadowMapWidth = 1024
light.shadowMapHeight = 1024

//////////////////////////////////////////////////////////////////////////////////
//		added starfield							//
//////////////////////////////////////////////////////////////////////////////////

var starSphere = THREEx.Planets.createStarfield()
scene.add(starSphere)

//////////////////////////////////////////////////////////////////////////////////
//		add an object and make it move					//
//////////////////////////////////////////////////////////////////////////////////

// var datGUI	= new dat.GUI()

var containerEarth = new THREE.Object3D()
containerEarth.rotateZ(-23.4 * Math.PI / 180)
containerEarth.position.z = 0
scene.add(containerEarth)

var createJupiter = THREEx.Planets.createJupiter()
createJupiter.scale.multiplyScalar(1 / 5)
createJupiter.receiveShadow = true
createJupiter.castShadow = true
createJupiter.position.set(-1.1, 0.4, 1); // Position Moon at the bottom center
containerEarth.add(createJupiter)
onRenderFcts.push(function (delta, now) {
    createJupiter.rotation.y += 4 / 32 * delta;
})

var createMars = THREEx.Planets.createMars()
createMars.scale.multiplyScalar(2 / 5)
createMars.receiveShadow = true
createMars.castShadow = true
createMars.position.set(-1.7, -0.2, 1); // Position Moon at the bottom center
containerEarth.add(createMars)
onRenderFcts.push(function (delta, now) {
    createMars.rotation.y += 3 / 32 * delta;
})

var moonMesh = THREEx.Planets.createMoon()
moonMesh.scale.multiplyScalar(3.5 / 5)
moonMesh.receiveShadow = true
moonMesh.castShadow = true
moonMesh.position.set(-0.6, -1, 1); // Position Moon at the bottom center
containerEarth.add(moonMesh)
onRenderFcts.push(function (delta, now) {
    moonMesh.rotation.y += 2 / 32 * delta;
})

const x = 1.4;
const y = 0.4;
const z = 1;

var earthMesh = THREEx.Planets.createEarth()
earthMesh.receiveShadow = true
earthMesh.castShadow = true
earthMesh.position.set(x, y, z); // Position Earth on the left
containerEarth.add(earthMesh)
onRenderFcts.push(function (delta, now) {
    earthMesh.rotation.y += 2 / 32 * delta;
})


var earthCloud = THREEx.Planets.createEarthCloud()
earthCloud.receiveShadow = true
earthCloud.castShadow = true
earthCloud.position.set(x, y, z); // Position Earth on the left
containerEarth.add(earthCloud)
onRenderFcts.push(function (delta, now) {
    earthCloud.rotation.y += 1 / 8 * delta;
})

var projector = new THREE.Projector();
window.addEventListener('mousedown', function (event) {
    // Create a vector from the mouse position
    var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
    ); // Unproject the vector
    projector.unprojectVector(vector, camera);

    // Create a ray from the camera position through the mouse position
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    // Get the list of objects the ray intersects
    var intersects = ray.intersectObject(earthMesh);
    var intersects2 = ray.intersectObject(moonMesh);
    var intersects3 = ray.intersectObject(createMars);
    var intersects4 = ray.intersectObject(createJupiter);

    if (intersects.length > 0) {
        toggleModelListVisibility();
        switchValue('Earth');
        console.log(433);
    }
    if (intersects2.length > 0) {
        toggleModelListVisibility();
        switchValue('Earth');
        console.log(433);
    }
    if (intersects3.length > 0) {
        toggleModelListVisibility();
        switchValue('Earth');
        console.log(433);
    }
    if (intersects4.length > 0) {
        toggleModelListVisibility();
        switchValue('Earth');
        console.log(433);
    }
}, false);

//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse = { x: 0, y: 0 }
document.addEventListener('mousemove', function (event) {
    mouse.x = (event.clientX / window.innerWidth) * 0.05
    mouse.y = (event.clientY / window.innerHeight) * 0.05
}, false)
onRenderFcts.push(function (delta, now) {
    camera.position.x += (mouse.x * 5 - camera.position.x) * (delta * 3)
    camera.position.y += (mouse.y * 5 - camera.position.y) * (delta * 3)
    camera.lookAt(scene.position)
})

//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
onRenderFcts.push(function () {
    renderer.render(scene, camera);
})

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    // call each update function
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })
})

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    // camera.position .z = (camera.aspect) * 4;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to toggle model list visibility
function toggleModelListVisibility() {
    var modelList = document.getElementById('model-list');
    modelList.style.display = modelList.style.display === 'block' ? 'none' : 'block';
}

// Add click event listeners to each planet label
document.getElementById('earth-label').addEventListener('click', function () {
    toggleModelListVisibility();
});

document.getElementById('moon-label').addEventListener('click', function () {
    toggleModelListVisibility();
});

document.getElementById('mars-label').addEventListener('click', function () {
    toggleModelListVisibility();
});

document.getElementById('jupiter-label').addEventListener('click', function () {
    toggleModelListVisibility();
});

const innerJob = document.querySelector('#innerJob');
function switchValue(type) {
    if (type === 'Earth') {
        innerJob.innerHTML = "Earth"
    } else if (type === 'Moon') {
        innerJob.innerHTML = "Moon"
    } else if (type === 'Mars') {
        innerJob.innerHTML = "Mars"
    } else if (type === 'Jupiter') {
        innerJob.innerHTML = "Jupiter"
    } else {
        innerJob.innerHTML = "Space Galaxy"
    }
}
switchValue()
