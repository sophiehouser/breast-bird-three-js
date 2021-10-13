import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Textures
const image = new Image()
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = new THREE.Texture(image)
const colorTexture = textureLoader.load('/textures/color.jpg')
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping

/**
 * Scene Coordinate Constants
 */
const relativeCoordinates = {
    x: 0,
    y: 0
}

/**
 * feeder
 */
const feeder = {
    smallWidth: 1,
    smallHeight: 2,
    bigHeight: 3,
    bigWidth: 1,
}

/**
 * Feeder Left
 */
const feederLeftDetails = {
    offsetX: -4.5,
    offsetY: -5,
    width: feeder.bigWidth,
    height: feeder.bigHeight
}

/**
 * Feeder Middle
 */
const feederMiddleDetails = {
    offsetX: -2,
    offsetY: -5.5,
    width: feeder.smallWidth,
    height:feeder.smallHeight
}

/**
 * Feeder Right
 */
const feederRightDetails = {
    offsetX: 4,
    offsetY: -5,
    width: feeder.bigWidth,
    height: feeder.bigHeight
}

/**
 * Stream Speed
 */
const milkStreamSpeed = {
    left: .2,
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xff0000 );

// Loading Manager
const manager = new THREE.LoadingManager();

manager.onLoad = function ( ) {
	console.log( 'Loading complete!');
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

// GLTF Loader
const gltfLoader = new GLTFLoader(manager);

// Load Bird
const birdUrl = '/models/bird_2.gltf';

var gltfBird;
gltfLoader.load(birdUrl, (gltf) => {
    gltfBird = gltf.scene;

    //var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    gltfBird.traverse((o) => {
    if (o.isMesh) o.material = newMaterial;
    });

    gltfBird.position.z = relativeCoordinates.x
    gltfBird.position.y = relativeCoordinates.y

    scene.add(gltfBird);
});

// Load Feeder
const feederUrl = '/models/character.gltf';

var gltfLeftFeeder;
gltfLoader.load(feederUrl, (gltf) => {
    const gltfLeftFeeder = gltf.scene;

    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    // var newMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    gltfLeftFeeder.traverse((o) => {
    if (o.isMesh) o.material = newMaterial;
    });

    gltfLeftFeeder.position.z = relativeCoordinates.x + 9
    gltfLeftFeeder.position.y = relativeCoordinates.y + -9

    scene.add(gltfLeftFeeder);
});

var gltfRightFeeder;
gltfLoader.load(feederUrl, (gltf) => {
    const gltfRightFeeder = gltf.scene;

    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    // var newMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    gltfRightFeeder.traverse((o) => {
    if (o.isMesh) o.material = newMaterial;
    });

    gltfRightFeeder.position.z = relativeCoordinates.x - 9
    gltfRightFeeder.position.y = relativeCoordinates.y + -9

    scene.add(gltfRightFeeder);
});

var gltfMiddleFeeder;
gltfLoader.load(feederUrl, (gltf) => {
    const gltfMiddleFeeder = gltf.scene;

    var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    // var newMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    gltfMiddleFeeder.traverse((o) => {
    if (o.isMesh) o.material = newMaterial;
    });

    gltfMiddleFeeder.scale.set(.75,.75,.75);
    gltfMiddleFeeder.position.z = relativeCoordinates.x + 4
    gltfMiddleFeeder.position.y = relativeCoordinates.y + -9 + (-.75)

    scene.add(gltfMiddleFeeder);
});

// Light
const light = new THREE.PointLight( 0x404040 ); // soft white light
scene.add( light );

/**
 * Drop object
 */
class Drop {
    constructor(startX, startY, endY, speed, width, height) {
        this.speed = speed
        this.startY = startY
        this.endY = endY
        this.width = width
        this.height = height
        // this.dropGeometry = new THREE.BoxGeometry(width, height, 1)
        // this.dropMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
        // this.dropMesh = new THREE.Mesh(this.dropGeometry, this.dropMaterial)

        var gltfMiddleDrop;
        const dropUrl = '/models/drop.gltf';
        gltfLoader.load(dropUrl, (gltf) => {
            gltfMiddleDrop = gltf.scene;

            //var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
            var newMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            gltfMiddleDrop.traverse((o) => {
            if (o.isMesh) o.material = newMaterial;
            });

            gltfMiddleDrop.scale.set(.2,.2,.2);
            gltfMiddleDrop.position.z = startX
            gltfMiddleDrop.position.y = startY

            scene.add(gltfMiddleDrop);
        });
    
        this.animate = function() {
            if (gltfMiddleDrop) {
                if (gltfMiddleDrop.position.y < this.endY) {
                    gltfMiddleDrop.position.y = this.startY
                }
                gltfMiddleDrop.position.y -= this.speed
            }
        }
    }
}

// Create Drops

var drops = []
var dropLeft = new Drop(9, relativeCoordinates.y, -6, milkStreamSpeed.left, .5, .5)
var dropMiddle = new Drop(3.75, relativeCoordinates.y, relativeCoordinates.y + -7, milkStreamSpeed.left, .5, .5)
var dropRight = new Drop(-9, relativeCoordinates.y, -6, milkStreamSpeed.left, .5, .5)
drops.push(dropLeft)
drops.push(dropMiddle)
drops.push(dropRight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

function animateLeftDropStream(drops) {
    drops.forEach((drop) => {
        drop.animate() // 100, 200, 300
    });
}

function spawnDrops(elapsedTime) {
    if (elapsedTime > 2) {
        let newDrop = new Drop(feederLeft.position.x + 10, bird.position.y, feederLeft.position.y, milkStreamSpeed.left)
        drops.push(newDrop)
        clock.start()
    }
}

const tick = () =>
{
    // Update controls
    controls.update()

    // Animate drop
    //spawnDrops(clock.getElapsedTime())
    animateLeftDropStream(drops)
    //dropLeft.animate(bird.position.y, feederLeft.position.y)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

clock.start()
tick()