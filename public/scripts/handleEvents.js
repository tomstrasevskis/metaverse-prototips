import * as THREE from 'three';
import { buttonLabel } from './handleUI.js';

export function handleMouseClickEvent(camera, landMap, socket) {
    window.addEventListener('click', (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(landMap);

        if (intersects.length > 0) {
            const land = intersects[0].object;
            console.log("Land clicked!"); //////////// Debug

            buttonLabel(land.position, land, socket);
        }
    });
}

export function handleBuyButtonClick(land, socket) {

    console.log("Buy button!");
    // Buy land
    if (land.owner === null) {
        const clientName = prompt('Enter your name:');
        if (clientName) {
            socket.emit('initiateLandPurchase', {
                id: land.landId,
                owner: clientName
            });
        }
    }

}

export function handleSellButtonClick(land, socket) {

    console.log("Sell button!");
    // Sell land
    if (land.owner !== null) {
        socket.emit('initiateLandSell', {
            id: land.landId,
            owner: null
        });
    }

}