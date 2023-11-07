import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleBuyButtonClick, handleSellButtonClick } from './handleEvents.js';
import { scene } from '../client.js'

const UIRenderer = new CSS2DRenderer();

// Initialize UI
function initUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
    UIRenderer.domElement.style.position = 'absolute';
    UIRenderer.domElement.style.top = '0px';
    document.body.appendChild(UIRenderer.domElement);

}

// Initialize Controls
function initControls(camera) {

    const controls = new OrbitControls(camera, UIRenderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

}

// Render UI
function renderUI(scene, camera) {

    UIRenderer.render(scene, camera);

}

// Resize UI
function resizeUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
}

function createButtonLabel(position) {

    // Create label
    const labelDiv = document.getElementById('label');

    const label = new CSS2DObject(labelDiv);
    scene.add(label);

    label.position.set(position.x, position.y + 1, position.z);

    // Handle buttons
    const buyButton = document.getElementById('buyButton');
    buyButton.addEventListener('click', handleBuyButtonClick);

    const sellButton = document.getElementById('sellButton');
    sellButton.addEventListener('click', handleSellButtonClick);
}

export { initUI, initControls, renderUI, resizeUI, createButtonLabel };