const socket = window.io("/");

const Chat = {
  init() {
    // Join room
    socket.emit("join-room", 1);

    // New messages received
    socket.on("new-messages", (messages) => {
      console.log("New messages", messages);

      messages.forEach(({ message, from }) => {
        this.convertFormMessageToChatMessage(message, from);
      });
    });

    this.events();
  },

  convertFormMessageToChatMessage(messageText, user, color = "#9D9CFC") {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const messageUser = document.createElement("span");
    messageUser.classList.add("message-user");
    messageUser.textContent = user;
    messageUser.style.color = color;

    const messageP = document.createElement("span");
    messageP.classList.add("message-text");
    messageP.innerHTML = messageText;

    messageContainer.appendChild(messageUser);
    messageContainer.appendChild(messageP);

    document.querySelector(".messages").appendChild(messageContainer);
  },

  events() {
    document
      .querySelector(".actions-sendMessage")
      .addEventListener("click", () => {
        const textarea = document.querySelector(".input-message");
        const messageObj = {
          from: window.user,
          message: textarea.value,
        };

        textarea.value = "";
        socket.emit("new-message", messageObj);

        this.convertFormMessageToChatMessage(messageObj.message, window.user);
      });
  },
};

Chat.init();
