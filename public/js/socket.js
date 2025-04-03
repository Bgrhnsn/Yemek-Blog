const socket = io();

socket.on('updateOnlineUsers', (count) => {
  const onlineCountElement = document.getElementById('onlineCount');
  if (onlineCountElement) {
    onlineCountElement.textContent = count;
  }
});
