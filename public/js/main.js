const chatForm = document.getElementById('form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const inputmensaje = document.getElementById('msg');
const output2 = document.getElementById('output2');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();
//Alguien escribiendo
socket.on('chat:typing', function(data){
  output2.innerHTML += `<div class="onlineIcon"> Alquien está escriebiendo.</div> `
});

msg.addEventListener('keypress', function(){
socket.emit('chat:typing', username.value);
 
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<div class="messageBox backgroundLight">  ${message.text} ${message.time} </div> <p class="sentText pl-10 ">${message.username}  </p>
   
`;
  document.querySelector('.chat-messages').appendChild(div);
  message.value = ''
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}