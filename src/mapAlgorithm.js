import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from './config.js';

let mapSize = config.mapSize;

const land = [];

for (let row = 0; row < mapSize; row++) {
    for (let col = 0; col < mapSize; col++) {
        const id = uuidv4();
        const position = generatePosition(row, col);
        const owner = null;
        land.push({ id, position, owner });
    }
}

function generatePosition(row, col) {
    const x = col - Math.floor(mapSize / 2);
    const y = row - Math.floor(mapSize / 2);
    return [x, y];
}

const data = { "land": land };
const jsonData = JSON.stringify(data, null, 2);

fs.writeFile(config.mapPath, jsonData, (err) => {
    if (err) {
        console.error('Error writing JSON file: ', err);
    } else {
        console.log('JSON file has been created.');
    }
});