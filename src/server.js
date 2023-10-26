import express from 'express';
import fs from 'fs';
import config from './config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Create server
const app = express();
const server = createServer(app);
const io = new Server(server);

let mapData;

// Send files to client
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`🔵 Total client count: [${io.engine.clientsCount}]   🟢 [${socket.id}] connected!`);

    // Fetch map data
    fs.readFile(config.mapPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read map data:', err);
        } else {
            try {
                mapData = JSON.parse(data);
                io.to(socket.id).emit('mapData', mapData.land);
            } catch (error) {
                console.error('Failed to parse map data:', error);
            }
        }
    });

    // Share variables with client
    io.to(socket.id).emit('variables', {

        landSize: config.landSize,
        backgroundColor: config.backgroundColor,
        landColor: config.landColor,
        ownedLandColor: config.ownedLandColor,

    });

    socket.on('initiateLandPurchase', (data) => {

        try {

            // Update the owner of the land object with the matching ID
            const landToUpdate = mapData.land.find((land) => land.id === data.id);
            if (landToUpdate) {
                landToUpdate.owner = data.owner;
            } else {
                console.error('Land not found with ID:', data.id);
            }

            // Write the updated 'mapData' back to the JSON file
            fs.writeFile(config.mapPath, JSON.stringify(mapData), (writeErr) => {
                if (writeErr) {
                    console.error('Failed to write updated map data:', writeErr);
                } else {
                    io.emit('purchaseLand', data);
                }
            });

            console.log(`🟩 Land [${data.id}] purchased by [${data.owner}]`);
        } 
        catch (parseError) {
            console.error('Failed to parse map data:', parseError);
        }

    });

    socket.on('initiateLandSell', (data) => {

        try {

            // Update the owner of the land object with the matching ID
            const landToUpdate = mapData.land.find((land) => land.id === data.id);
            if (landToUpdate) {
                landToUpdate.owner = null;
            } else {
                console.error('Land not found with ID:', data.id);
            }

            // Write the updated 'mapData' back to the JSON file
            fs.writeFile(config.mapPath, JSON.stringify(mapData), (writeErr) => {
                if (writeErr) {
                    console.error('Failed to write updated map data:', writeErr);
                } else {
                    io.emit('sellLand', data);
                }
            });

            console.log(`🟥 Sold land [${data.id}]`);
        } 
        catch (parseError) {
            console.error('Failed to parse map data:', parseError);
        }

    });

    socket.on('disconnect', (reason) => {
        console.log(`🔵 Total client count: [${io.engine.clientsCount}]   🔴 [${socket.id}] disconnected!   🟣 Reason: [${reason}]`);
    });
});

server.listen(config.port, () => {
    console.log(`🟦 Server is running on [http://localhost:${config.port}]`);
});