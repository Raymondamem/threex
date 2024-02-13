// import * as THREE from 'three';
console.log(THREE)
var THREEx = THREEx || {}

THREEx.Planets = {}

THREEx.Planets.baseURL = '../'

THREEx.Planets.createEarth = function () {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthbump1k.jpg'),
        bumpScale: 0.05,
        specularMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthspec1k.jpg'),
        specular: new THREE.Color('grey'),
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

THREEx.Planets.createEarthCloud = function () {
    // create destination canvas
    var canvasResult = document.createElement('canvas')
    canvasResult.width = 1024
    canvasResult.height = 512
    var contextResult = canvasResult.getContext('2d')

    // load earthcloudmap
    var imageMap = new Image();
    imageMap.addEventListener("load", function () {

        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas')
        canvasMap.width = imageMap.width
        canvasMap.height = imageMap.height
        var contextMap = canvasMap.getContext('2d')
        contextMap.drawImage(imageMap, 0, 0)
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

        // load earthcloudmaptrans
        var imageTrans = new Image();
        imageTrans.addEventListener("load", function () {
            // create dataTrans ImageData for earthcloudmaptrans
            var canvasTrans = document.createElement('canvas')
            canvasTrans.width = imageTrans.width
            canvasTrans.height = imageTrans.height
            var contextTrans = canvasTrans.getContext('2d')
            contextTrans.drawImage(imageTrans, 0, 0)
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
            // merge dataMap + dataTrans into dataResult
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height)
            for (var y = 0, offset = 0; y < imageMap.height; y++) {
                for (var x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0]
                    dataResult.data[offset + 1] = dataMap.data[offset + 1]
                    dataResult.data[offset + 2] = dataMap.data[offset + 2]
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0]
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0)
            material.map.needsUpdate = true;
        })
        imageTrans.src = THREEx.Planets.baseURL + 'images/earthcloudmaptrans.jpg';
    }, false);
    imageMap.src = THREEx.Planets.baseURL + 'images/earthcloudmap.jpg';

    var geometry = new THREE.SphereGeometry(0.51, 32, 32)
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

THREEx.Planets.createMoon = function () {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonbump1k.jpg'),
        bumpScale: 0.002,
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

THREEx.Planets.createMars = function () {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/marsmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/marsbump1k.jpg'),
        bumpScale: 0.05,
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

THREEx.Planets.createJupiter = function () {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32)
    var texture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/jupitermap.jpg')
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.02,
    })
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

// Define other planet creation functions here...

THREEx.Planets.createStarfield = function () {
    var texture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/galaxy_starfield.png')
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    })
    var geometry = new THREE.SphereGeometry(100, 32, 32)
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * change the original from three.js because i needed different UV
 * 
 * @author Kaleb Murphy
 * @author jerome etienne
 */
THREEx.Planets._RingGeometry = function (innerRadius, outerRadius, thetaSegments) {

    THREE.Geometry.call(this)

    innerRadius = innerRadius || 0
    outerRadius = outerRadius || 50
    thetaSegments = thetaSegments || 8

    var normal = new THREE.Vector3(0, 0, 1)

    for (var i = 0; i < thetaSegments; i++) {
        var angleLo = (i / thetaSegments) * Math.PI * 2
        var angleHi = ((i + 1) / thetaSegments) * Math.PI * 2

        var vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0);
        var vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0);
        var vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0);
        var vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0);

        this.vertices.push(vertex1);
        this.vertices.push(vertex2);
        this.vertices.push(vertex3);
        this.vertices.push(vertex4);


        var vertexIdx = i * 4;

        // Create the first triangle
        var face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal);
        var uvs = []

        var uv = new THREE.Vector2(0, 0)
        uvs.push(uv)
        var uv = new THREE.Vector2(1, 0)
        uvs.push(uv)
        var uv = new THREE.Vector2(0, 1)
        uvs.push(uv)

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);

        // Create the second triangle
        var face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal);
        var uvs = []

        var uv = new THREE.Vector2(0, 1)
        uvs.push(uv)
        var uv = new THREE.Vector2(1, 0)
        uvs.push(uv)
        var uv = new THREE.Vector2(1, 1)
        uvs.push(uv)

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);
    }

    this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius);

};
THREEx.Planets._RingGeometry.prototype = Object.create(THREE.Geometry.prototype);


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
