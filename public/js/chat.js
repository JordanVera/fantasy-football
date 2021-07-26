
const Chat = {
  init(user) {
    const socket = window.io.connect();
    this.socket = socket;
    this.user = user;

    // Join room
    socket.on('connect', () => {
      console.log('connected');

      setTimeout(() => {
        socket.emit('join-room', 1);
      }, 1000);
    });

    // New messages received
    socket.on('new-messages', (messages) => {
      console.log('New messages', messages);

      messages.forEach(({ message, from }) => {
        this.convertFormMessageToChatMessage(message, from);
      });
    });

    this.events();
  },

  getColor (username) {
    const colorList = [
      'rgb(255, 127, 80)',
      'rgb(0, 255, 127)',
      'rgb(255, 69, 0)',
      'rgb(30, 144, 255)',
      'rgb(205, 35, 233)',
      'rgb(249, 255, 10)',
    ];

    if (!this.usernamesColors) {
      this.usernamesColors = {};
    }

    if (!this.usernamesColors[username]) {
      const index = Object.keys(this.usernamesColors).length % colorList.length;
      this.usernamesColors[username] = colorList[index];
    }

    return this.usernamesColors[username];
  },

  convertFormMessageToChatMessage(messageText, user) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const messageUser = document.createElement('span');
    messageUser.classList.add('message-user');
    messageUser.textContent = user;
    messageUser.style.color = this.getColor(user);

    const messageP = document.createElement('span');
    messageP.classList.add('message-text');
    messageP.innerHTML = messageText;

    messageContainer.appendChild(messageUser);
    messageContainer.appendChild(messageP);

    document.querySelector('.messages').appendChild(messageContainer);
  },

  events() {
    const { socket } = this;
    document
      .querySelector('.actions-sendMessage')
      .addEventListener('click', () => {
        const textarea = document.querySelector('.input-message');
        const messageObj = {
          from: this.user,
          message: textarea.value,
        };

        textarea.value = '';
        socket.emit('new-message', messageObj);

        this.convertFormMessageToChatMessage(messageObj.message, this.user);
      });

    $('.input-message').on('keypress', (event) => {
      if (event.originalEvent.keyCode === 13) {
        $('.actions-sendMessage').click();
      }
    })
  },
};
