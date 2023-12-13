import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleBuyButtonClick, handleSellButtonClick } from './handleEvents.js';
import { scene } from '../client.js'

const UIRenderer = new CSS2DRenderer();

// Initialize UI
export function initUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
    UIRenderer.domElement.style.position = 'absolute';
    UIRenderer.domElement.style.top = '0px';
    document.body.appendChild(UIRenderer.domElement);

}

// Initialize Controls
export function initControls(camera) {

    const controls = new OrbitControls(camera, UIRenderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.maxDistance = 2000;

}

// Render UI
export function renderUI(scene, camera) {

    UIRenderer.render(scene, camera);

}

// Resize UI
export function resizeUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
}

export function buttonLabel(position, land, socket) {

    // Create button label object
    const labelDiv = document.getElementById('label');
    labelDiv.classList.remove("hidden");

    const label = new CSS2DObject(labelDiv);
    scene.add(label);

    label.position.set(position.x, position.y + 1, position.z);

    // Handle buy button
    const buyButton = document.getElementById('buyButton');
    buyButton.addEventListener('click', handleBuyButtonClick(land, socket));

    // Handle sell button
    const sellButton = document.getElementById('sellButton');
    sellButton.addEventListener('click', handleSellButtonClick(land, socket));
}