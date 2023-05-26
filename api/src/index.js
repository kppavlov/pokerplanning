"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var Server = require("socket.io").Server;
var io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://poker.threesixtybg.com"],
        methods: ["GET", "POST"],
    },
});
var roomUsersMap = new Map();
io.on("connection", function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var roomName, userName;
    return __generator(this, function (_a) {
        roomName = socket.handshake.query.room;
        userName = socket.handshake.query.name;
        (0, utils_1.joinUserToRoom)({ roomsMap: roomUsersMap, roomName: roomName, socket: socket, userName: userName });
        socket.on("disconnecting", function () {
            console.log("DIsconnecting");
            (0, utils_1.removeUserFromRoom)({ socket: socket, roomsMap: roomUsersMap });
        });
        socket.on("vote-chosen", function (_a) {
            var cardId = _a.cardId, roomId = _a.roomId, userName = _a.userName;
            var users = (0, utils_1.updateUserVote)({
                roomsMap: roomUsersMap,
                room: roomId,
                userName: userName,
                vote: cardId,
            });
            io.to(roomId).emit("vote-chosen", users);
        });
        socket.on("reveal-result", function (roomId) {
            io.to(roomId).emit("reveal-result");
        });
        return [2 /*return*/];
    });
}); });
io.of("/").adapter.on("create-room", function (room) {
    console.log("room has been created", room);
});
io.of("/").adapter.on("join-room", function (room, id) {
    console.log("joining room", room, id);
    io.to(room).emit("user-joined", roomUsersMap.get(room));
});
io.of("/").adapter.on("leave-room", function (room, id) {
    console.log("leave room", room, id);
});
server.listen(3000, function () {
    console.log("listening on *:3000");
});
