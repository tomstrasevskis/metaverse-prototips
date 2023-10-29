import * as THREE from 'three';
import { buyButton, sellButton } from './handleUI.js';

function handleMouseClickEvent(camera, landMap, socket) {
    window.addEventListener('click', (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(landMap);

        if (intersects.length > 0) {
            const land = intersects[0].object;

            buyButton(land.position);
            sellButton(land.position);

            /*// Buy land
            if (land.owner === null) {
                const clientName = prompt('Enter your name:');
                if (clientName) {
                    socket.emit('initiateLandPurchase', {
                        id: land.landId,
                        owner: clientName
                    });
                }
            }
            // Sell land
            else if (land.owner !== null) {
                socket.emit('initiateLandSell', {
                    id: land.landId,
                    owner: null
                });
            }*/
        }
    });
}

function handleBuyButtonClick() {

    console.log("buy button");

}

function handleSellButtonClick() {

    console.log("sell button");

}

export { handleMouseClickEvent, handleBuyButtonClick, handleSellButtonClick };