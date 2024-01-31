import * as THREE from 'three';
import { moveButtonLabel, hideButtonLabel } from './handleUI.js';

export let land;

export function handleMouseClickEvent(camera, landMap) {
    window.addEventListener('click', (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(landMap);

        if (intersects.length > 0) {

            land = intersects[0].object;
            moveButtonLabel(land.position);

        } else  {
            hideButtonLabel();
        }
    });
}

export function handleBuyButtonClick(land, socket) {

    // Buy land
    if (land.owner === null) {
        let clientName = prompt('Enter your name:');
        if (clientName) {
            socket.emit('initiateLandPurchase', {
                id: land.landId,
                owner: clientName
            });
            hideButtonLabel();
        }
    } else {
        hideButtonLabel();
    }

}

export function handleSellButtonClick(land, socket) {

    // Sell land
    if (land.owner !== null) {
        socket.emit('initiateLandSell', {
            id: land.landId,
            owner: null
        });
    } else {
        hideButtonLabel();
    }

}