import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const socket = io(); // Initiate the connection between client and server

let camera, scene, renderer, effect;
let container, stats;

const landMap = [];

let landSize, landColor, ownedLandColor;

// Receive the variables from the server
socket.on('variables', (initialVariables) => {

    let backgroundColor = initialVariables.backgroundColor;

    landSize = initialVariables.landSize;
    landColor = initialVariables.landColor;
    ownedLandColor = initialVariables.ownedLandColor;

    // After receiving variables, initialize the scene
    init(backgroundColor);
    animate();

});

// Load the map
socket.on('mapData', loadMap);

function loadMap(mapData) {
    mapData.forEach(land => {
        const geometry = new THREE.BoxGeometry(landSize, 1, landSize);
        const material = new THREE.MeshToonMaterial({ color: landColor });
        const landMesh = new THREE.Mesh(geometry, material);

        landMesh.position.set(land.position[0] * landSize, 0, land.position[1] * landSize);
        landMesh.landId = land.id;
        landMesh.owner = land.owner;

        if (land.owner !== null) {

            landMesh.material.color.setHex(ownedLandColor);

        }

        // Add to the scene
        scene.add(landMesh);

        // Add to the array
        landMap.push(landMesh);
    });
}

window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(landMap);

    if (intersects.length > 0) {
        const land = intersects[0].object;

        // Buy land
        if (land.owner === null) {

            const clientName = prompt('Enter your name:');
            if (clientName) {
                socket.emit('initiateLandPurchase', {
                    id: land.landId,
                    owner: clientName
                })
            }
        }
        // Sell land
        else if (land.owner !== null) {

            socket.emit('initiateLandSell', {
                id: land.landId,
                owner: null
            })
        }
    }
});

socket.on('purchaseLand', (data) => {
    const land = landMap.find((landMesh) => landMesh.landId === data.id);

    // Checks if land with that id exists
    if (land) {

        land.owner = data.owner;
        land.material.color.setHex(ownedLandColor);
        console.log(`Land [${data.id}] purchased by [${data.owner}]`);

    }
});

socket.on('sellLand', (data) => {
    const land = landMap.find((landMesh) => landMesh.landId === data.id);

    // Checks if land with that id exists
    if (land) {

        land.owner = null;
        land.material.color.setHex(landColor);
        console.log(`Sold land [${land.landId}]`);

    }
});

function init(backgroundColor) {

    // Canvas
    container = document.createElement('div');
    document.body.appendChild(container);

    // Camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.set(0, 10, -10);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: AA(), powerPreference: "high-performance" });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Effects and stats
    effect = new OutlineEffect(renderer);
    stats = new Stats();
    container.appendChild(stats.dom);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 2000;

    // Handle windows resize
    window.addEventListener('resize', onWindowResize);
}

function render() {
    effect.render(scene, camera);
}

function AA() {
    let pixelRatio = window.devicePixelRatio;
    if (pixelRatio > 1) {
        return false;
    } else {
        return true;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    stats.begin();
    render();
    stats.end();

}