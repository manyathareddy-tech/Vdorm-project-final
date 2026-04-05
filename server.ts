import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      if (parsedUrl.pathname?.startsWith('/socket.io/')) {
        // Let socket.io handle it
        return;
      }
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('new_complaint', (data) => {
      console.log('New complaint received:', data);
      // Broadcast to all clients (specifically for warden)
      io.emit('complaint_notification', data);
    });

    socket.on('status_update', (data) => {
      console.log('Status update:', data);
      io.emit('status_notification', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Simulate urgent maintenance requests every 45 seconds
  setInterval(() => {
    const issues = ['Water Leakage', 'Power Outage', 'Broken Window', 'Elevator Stuck'];
    const locations = ['Block A, 3rd Floor', 'Block B, Ground Floor', 'Room 204', 'Main Lobby'];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    io.emit('maintenance_notification', { issue, location });
  }, 45000);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
