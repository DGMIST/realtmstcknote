"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var body_parser_1 = __importDefault(require("body-parser"));
var expressApp = (0, express_1.default)();
var server = http_1.default.createServer(expressApp);
var jwtSecret = 'YOUR_SECRET_HERE';
var PORT = 4000;
var io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        allowedHeaders: [],
        credentials: true,
    },
});
var users = [];
var notes = [];
expressApp.use(body_parser_1.default.json());
expressApp.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
expressApp.post('/api/verify', function (req, res) {
    var name = req.body.name;
    if (users.find(function (user) { return user.name === name; })) {
        res.status(409);
        res.json({ error: 'User with this name is already taken' });
        return;
    }
    var id = (0, util_1.generateId)();
    var user = {
        id: id,
        name: name,
    };
    var token = jsonwebtoken_1.default.sign({ user: user }, jwtSecret);
    users = __spreadArray(__spreadArray([], users, true), [user], false);
    res.status(200);
    res.json(__assign(__assign({}, user), { token: token, notes: notes }));
});
io.on('connection', function (socket) {
    socket.on('get_update', function () {
        socket.emit('note_created', notes);
    });
    socket.on('update_note', function (data) {
        var note = data.note;
        notes = notes === null || notes === void 0 ? void 0 : notes.map(function (memoryNote) {
            if (memoryNote.id === note.id) {
                return note;
            }
            return memoryNote;
        });
        socket.broadcast.emit('update', data.note);
    });
    socket.on('create_note', function (data) {
        notes = __spreadArray(__spreadArray([], notes, true), [data.newNote], false);
        socket.broadcast.emit('note_created', notes);
    });
});
server.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
