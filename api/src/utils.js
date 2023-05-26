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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserVote = exports.removeUserFromRoom = exports.joinUserToRoom = exports.checkIfRoomExists = void 0;
var checkIfRoomExists = function (roomName, roomsMap) {
    return roomsMap.has(roomName);
};
exports.checkIfRoomExists = checkIfRoomExists;
var joinUserToRoom = function (_a) {
    var roomsMap = _a.roomsMap, roomName = _a.roomName, socket = _a.socket, userName = _a.userName;
    if ((0, exports.checkIfRoomExists)(roomName, roomsMap)) {
        var socketsInTheRoom = roomsMap.get(roomName);
        var hasUserWithSameName = socketsInTheRoom.some(function (user) { return user.userName === userName; });
        if (hasUserWithSameName) {
            return false;
        }
        roomsMap.set(roomName, __spreadArray(__spreadArray([], socketsInTheRoom, true), [
            { userName: userName, id: socket.id, vote: null },
        ], false));
        socket.join(roomName);
        return true;
    }
    roomsMap.set(roomName, [{ userName: userName, id: socket.id, vote: null }]);
    socket.join(roomName);
};
exports.joinUserToRoom = joinUserToRoom;
var removeUserFromRoom = function (_a) {
    var roomsMap = _a.roomsMap, socket = _a.socket;
    var rooms = socket.rooms.entries();
    for (var _i = 0, rooms_1 = rooms; _i < rooms_1.length; _i++) {
        var _b = rooms_1[_i], key = _b[0], value = _b[1];
        if (!(0, exports.checkIfRoomExists)(key, roomsMap)) {
            continue;
        }
        var roomUsers = roomsMap.get(key);
        var remainingUsers = roomUsers.filter(function (user) { return user.id !== socket.id; });
        if (!remainingUsers.length) {
            roomsMap.delete(key);
            return;
        }
        roomsMap.set(key, remainingUsers);
    }
};
exports.removeUserFromRoom = removeUserFromRoom;
var updateUserVote = function (_a) {
    var roomsMap = _a.roomsMap, room = _a.room, vote = _a.vote, userName = _a.userName;
    var users = roomsMap.get(room);
    var usersWithUpdatedVote = users.map(function (user) {
        if (user.userName === userName) {
            return __assign(__assign({}, user), { vote: vote });
        }
        return user;
    });
    roomsMap.set(room, usersWithUpdatedVote);
    return usersWithUpdatedVote;
};
exports.updateUserVote = updateUserVote;
