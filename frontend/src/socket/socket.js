import { io } from 'socket.io-client';

const SOCKET_URL = 'https://smart-ward.onrender.com';

let socket = null;

/**
 * Initialise and return the singleton Socket.io connection.
 * Falls back gracefully if the server doesn't support WebSockets.
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error — falling back to polling:', err.message);
    });
  }
  return socket;
};

/**
 * Disconnect the socket cleanly.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
