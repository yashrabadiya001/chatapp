const socket = io('http://localhost:3000');
let currentRoom = 'General';
let username = prompt("Enter your username:") || 'Guest';

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const roomList = document.getElementById('roomList');

// Join default room
socket.emit('joinRoom', { username, room: currentRoom });

socket.on('message', (data) => {
    displayMessage(data.username, data.message, data.timestamp);
});

function joinRoom(room) {
    currentRoom = room;
    messagesDiv.innerHTML = '';
    socket.emit('joinRoom', { username, room });
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    const timestamp = new Date().toLocaleTimeString();
    socket.emit('chatMessage', { room: currentRoom, username, message: messageText, timestamp });

    messageInput.value = '';
}

function displayMessage(user, message, time) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${user}</strong>: ${message} <span class="timestamp">${time}</span>`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function createRoom() {
    const newRoom = document.getElementById('newRoomInput').value.trim();
    if (newRoom) {
        const roomElement = document.createElement('div');
        roomElement.classList.add('room');
        roomElement.innerText = newRoom;
        roomElement.onclick = () => joinRoom(newRoom);
        roomList.appendChild(roomElement);

        document.getElementById('newRoomInput').value = '';
    }
}
