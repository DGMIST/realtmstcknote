import { generateId } from './util';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import bp from 'body-parser';

const expressApp = express();
const server = http.createServer(expressApp);
const jwtSecret = 'YOUR_SECRET_HERE';
const PORT = 4000;

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: [],
    credentials: true,
  },
});

type ResponseData = {
  id?: string;
  token?: string;
  notes?: Note[];
  error?: {
    message: string;
  };
  json: (obj: User | { error: string }) => void;
  status: (code: number) => void;
};

type User = {
  id: string;
  name: string;
  token?: string;
  notes?: Note[];
};

type Note = {
  id: string;
  userId: string;
  userName: string;
  posX: number;
  posY: number;
  color: string;
  initalPosition: {
    x: number;
    y: number;
  };
};

let users: User[] = [];
let notes: Note[] = [];

expressApp.use(bp.json());
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

expressApp.post('/api/verify', (req, res: ResponseData) => {
  const name: string = req.body.name;
  if (users.find((user: User) => user.name === name)) {
    res.status(409);
    res.json({ error: 'User with this name is already taken' });
    return;
  }

  const id: string = generateId();
  const user: User = {
    id,
    name,
  };
  const token: string = jwt.sign({ user }, jwtSecret);
  users = [...users, user];
  res.status(200);
  res.json({ ...user, token, notes });
});

io.on('connection', (socket: Socket) => {
  socket.on('get_update', () => {
    socket.emit('note_created', notes);
  });
  socket.on('update_note', (data) => {
    const { note } = data;
    notes = notes?.map((memoryNote: Note) => {
      if (memoryNote.id === note.id) {
        return note;
      }

      return memoryNote;
    });
    socket.broadcast.emit('update', data.note);
  });

  socket.on('create_note', (data) => {
    notes = [...notes, data.newNote];
    socket.broadcast.emit('note_created', notes);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
