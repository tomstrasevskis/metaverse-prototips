import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { handleMouseClickEvent } from './scripts/handleEvents.js';
import { initUI, initControls, renderUI, resizeUI } from './scripts/handleUI.js';

const socket = io(); // Initiate the connection between client and server

export let camera, scene, renderer, effect, stats;

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
    document.body.appendChild(renderer.domElement);

    // UI and Controls
    initUI();
    initControls(camera);

    // Effects and stats
    effect = new OutlineEffect(renderer);
    stats = new Stats();
    document.body.appendChild(stats.dom);
    
    // Handle windows resize
    window.addEventListener('resize', onWindowResize);

    // Handle mouse events
    handleMouseClickEvent(camera, landMap, socket);
}

function renderScene() {
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
    resizeUI();

}

function animate() {

    requestAnimationFrame(animate);
    stats.begin();

    renderScene();
    renderUI(scene, camera);

    stats.end();

}