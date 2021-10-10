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

// Load Bird
const gltfLoader = new GLTFLoader();
const birdUrl = '/models/bird_2.gltf';
gltfLoader.load(birdUrl, (gltf) => {
const root = gltf.scene;
//var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
root.traverse((o) => {
  if (o.isMesh) o.material = newMaterial;
});
scene.add(root);
});

// Load Feeder
const feederUrl = '/models/character.gltf';
gltfLoader.load(feederUrl, (gltf) => {
const root = gltf.scene;
//var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
var newMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
root.traverse((o) => {
  if (o.isMesh) o.material = newMaterial;
});
scene.add(root);
});

// Light
const light = new THREE.PointLight( 0x404040 ); // soft white light
scene.add( light );

/**
 * Bird
 */
const birdGeometry = new THREE.BoxGeometry(10, 2, 1)
const birdMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
const bird = new THREE.Mesh(birdGeometry, birdMaterial)
bird.position.x = relativeCoordinates.x
bird.position.y = relativeCoordinates.y
scene.add(bird)

/**
 * Feeder Left
 */
const feederLeftGeometry = new THREE.BoxGeometry(feederLeftDetails.width, feederLeftDetails.height, 1)
const feederLeftMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
const feederLeft = new THREE.Mesh(feederLeftGeometry, feederLeftMaterial)
feederLeft.position.x = relativeCoordinates.x + feederLeftDetails.offsetX
feederLeft.position.y = relativeCoordinates.y + feederLeftDetails.offsetY
scene.add(feederLeft)

/**
 * Feeder Middle
 */
const feederMiddleGeometry = new THREE.BoxGeometry(feederMiddleDetails.width, feederMiddleDetails.height, 1)
const feederMiddleMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
const feederMiddle = new THREE.Mesh(feederMiddleGeometry, feederMiddleMaterial)
feederMiddle.position.x = relativeCoordinates.x + feederMiddleDetails.offsetX
feederMiddle.position.y = relativeCoordinates.y + feederMiddleDetails.offsetY
scene.add(feederMiddle)

/**
 * Feeder Right
 */
const feederRightGeometry = new THREE.BoxGeometry(feederRightDetails.width, feederRightDetails.height, 1)
const feederRightMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
const feederRight = new THREE.Mesh(feederRightGeometry, feederRightMaterial)
feederRight.position.x = relativeCoordinates.x + feederRightDetails.offsetX
feederRight.position.y = relativeCoordinates.y + feederRightDetails.offsetY
scene.add(feederRight)

/**
 * drop
 */
class Drop {
    constructor(startX, startY, endY, speed, width, height) {
        this.speed = speed
        this.startY = startY
        this.endY = endY
        this.width = width
        this.height = height
        this.dropGeometry = new THREE.BoxGeometry(width, height, 1)
        this.dropMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
        this.dropMesh = new THREE.Mesh(this.dropGeometry, this.dropMaterial)
        this.dropMesh.position.x = startX 
        this.dropMesh.position.y = startY 
        scene.add(this.dropMesh)

        this.animate = function() {
            if (this.dropMesh.position.y < this.endY) {
                this.dropMesh.position.y = this.startY
            }
            this.dropMesh.position.y -= this.speed
        }
    }
}

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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

var drops = []
var dropLeft = new Drop(feederLeft.position.x, bird.position.y, feederLeft.position.y, milkStreamSpeed.left, .5, .5)
var dropMiddle = new Drop(feederMiddle.position.x, bird.position.y, feederLeft.position.y, milkStreamSpeed.left, .5, .5)
var dropRight = new Drop(feederRight.position.x, bird.position.y, feederLeft.position.y, milkStreamSpeed.left, .5, .5)
drops.push(dropLeft)
drops.push(dropMiddle)
drops.push(dropRight)

function animateLeftDropStream(drops) {
    drops.forEach((drop) => {
        drop.animate() // 100, 200, 300
    });
}

function spawnDrops(elapsedTime) {
    console.log(elapsedTime)
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
    spawnDrops(clock.getElapsedTime())
    animateLeftDropStream(drops)
    //myDrop.animate(bird.position.y, feederLeft.position.y)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

clock.start()
tick()