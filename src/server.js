import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { exec } from 'child_process';
import config from './config.js';

// ANSI escape codes for colors and styles
const reset = '\x1b[0m';
const bold = '\x1b[1m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const blue = '\x1b[34m';
const purple = '\x1b[35m';

// Create server
const app = express();
const server = createServer(app);
const io = new Server(server);

let mapData;

// Send files to client
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`${blue}${bold}[#] Total client count: [${io.engine.clientsCount}]   ${reset}${green}[@] [${socket.id}] connected!${reset}`);

    // Check if map data exists
    fs.access(config.mapPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`${red}[-] Map data doesn't exist. Running the map generation algorithm...${reset}`);
            // Check if map algorithm exists
            fs.access(config.mapAlgorithm, fs.constants.F_OK, (err) => {
                if (err) {
                    // The map algorithm doesn't exist
                    console.error(`${red}[-] The map generation algorithm doesn't exist.${reset}`);
                } else {
                    // Run the script using child process
                    console.log(`${purple}[=] Generating the map data.${reset}`);
                    exec(`node ${config.mapAlgorithm}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`${red}[-] Error running the map algorithm: ${error.message}${reset}`);
                            return;
                        }
                        console.log(`${purple}[=] The map data has been generated.${reset}`);
                    });
                }
            });
        } else {
            // Fetch map data
            console.log(`${purple}[=] Fetching the map data.${reset}`);
            fs.readFile(config.mapPath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`${red}[-] Failed to read map data:${reset}`, err);
                } else {
                    try {
                        mapData = JSON.parse(data);
                        io.to(socket.id).emit('mapData', mapData.land);
                        console.log(`${green}[+] The map data has been fetched.${reset}`);
                    } catch (error) {
                        console.error(`${red}[-] Failed to parse map data:`, error);
                    }
                }
            });
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
                console.error(`${red}[-] Land not found with ID:`, data.id);
            }

            // Write the updated 'mapData' back to the JSON file
            fs.writeFile(config.mapPath, JSON.stringify(mapData), (writeErr) => {
                if (writeErr) {
                    console.error(`${red}[-] Failed to write updated map data:`, writeErr);
                } else {
                    io.emit('purchaseLand', data);
                }
            });

            console.log(`${green}[•]${reset} Land ${green}[${data.id}]${reset} has been purchased by ${green}[${data.owner}].${reset}`);
        }
        catch (parseError) {
            console.error(`${red}[-] Failed to parse map data:`, parseError);
        }

    });

    socket.on('initiateLandSell', (data) => {

        try {

            // Update the owner of the land object with the matching ID
            const landToUpdate = mapData.land.find((land) => land.id === data.id);
            if (landToUpdate) {
                landToUpdate.owner = null;
            } else {
                console.error(`${red}[-] Land not found with ID:`, data.id);
            }

            // Write the updated 'mapData' back to the JSON file
            fs.writeFile(config.mapPath, JSON.stringify(mapData), (writeErr) => {
                if (writeErr) {
                    console.error(`${red}[-] Failed to write updated map data:`, writeErr);
                } else {
                    io.emit('sellLand', data);
                }
            });

            console.log(`${red}[•]${reset} Land ${red}[${data.id}]${reset} has been sold.`);
        }
        catch (parseError) {
            console.error(`${red}[-] Failed to parse map data:`, parseError);
        }

    });

    socket.on('disconnect', (reason) => {
        console.log(`${blue}${bold}[#] Total client count: [${io.engine.clientsCount}]   ${reset}${red}[@] [${socket.id}] disconnected!${reset}`);
    });
});

server.listen(config.port, () => {
    console.log(`${blue}${bold}[•] Server is running on [http://localhost:${config.port}]${reset}`);
});