import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { handleBuyButtonClick, handleSellButtonClick, land } from './handleEvents.js';
import { scene, socket } from '../client.js'

const UIRenderer = new CSS2DRenderer();

let label;
let labelDiv;

// Move Button Label
export function moveButtonLabel(position) {

    labelDiv.classList.remove("hidden");
    label.position.set(position.x, position.y + 1, position.z);

}

// Hide Button Label
export function hideButtonLabel() {
    labelDiv.classList.add("hidden");
}

// Initialize UI
export function initUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);
    UIRenderer.domElement.style.position = 'absolute';
    UIRenderer.domElement.style.top = '0px';
    document.body.appendChild(UIRenderer.domElement);

    labelDiv = document.getElementById('label');
    const buy_button = document.getElementById('buyButton');
    const sell_button = document.getElementById('sellButton');

    buy_button.textContent = "Buy";
    sell_button.textContent = "Sell";

    buy_button.style = "--clr:#219C90";
    sell_button.style = "--clr:#D83F31";

    buy_button.addEventListener('pointerdown', function () {
        handleBuyButtonClick(land, socket);
    });

    sell_button.addEventListener('pointerdown', function () {
        handleSellButtonClick(land, socket);
    });

    label = new CSS2DObject(labelDiv);
    scene.add(label);

}

// Initialize Controls
export function initControls(camera) {

    const controls = new MapControls(camera, UIRenderer.domElement);

    controls.enableDamping = false;

    controls.minDistance = 30;
    controls.maxDistance = 300;

    controls.maxPolarAngle = Math.PI / 2;

}

// Render UI
export function renderUI(scene, camera) {

    UIRenderer.render(scene, camera);

}

// Resize UI
export function resizeUI() {

    UIRenderer.setSize(window.innerWidth, window.innerHeight);

}