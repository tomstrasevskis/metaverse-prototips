import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleBuyButtonClick, handleSellButtonClick } from './handleEvents.js';
import { scene } from '../client.js'

const UIRenderer = new CSS2DRenderer();

// Initialize UI
function initUI(container) {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
    UIRenderer.domElement.style.position = 'absolute';
    UIRenderer.domElement.style.top = '0px';
    container.appendChild(UIRenderer.domElement);

}

// Initialize Controls
function initControls(camera) {

    const controls = new OrbitControls(camera, UIRenderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.maxDistance = 2000;
    controls.enableDamping = true;

}

// Render UI
function renderUI(scene, camera) {

    UIRenderer.render(scene, camera);

}

// Resize UI
function resizeUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Buy button
function buyButton(position) {

    const button = document.createElement('button');
    button.textContent = 'Buy';
    button.addEventListener('click', handleBuyButtonClick);

    const buyButtonObject = new CSS2DObject(button);
    scene.add(buyButtonObject);

    buyButtonObject.position.set(position.x, position.y + 1, position.z);

}

// Sell button
function sellButton(position) {

    const button = document.createElement('button');
    button.textContent = 'Sell';
    button.addEventListener('click', handleSellButtonClick);

    const sellButtonObject = new CSS2DObject(button);
    sellButtonObject.position.set(position.x, position.y + 1, position.z);

}

export { initUI, initControls, renderUI, resizeUI, buyButton, sellButton };