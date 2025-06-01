<!DOCTYPE html>
<html>
<head>
  <title>Self-Destruct Chat</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <h2>Chat App</h2>
  <input id="to" placeholder="Receiver ID" />
  <input id="msg" placeholder="Message" />
  <button onclick="sendMessage()">Send</button>

  <ul id="chat"></ul>

  <script>
    const socket = io();

    const chat = document.getElementById("chat");

    socket.on("connect", () => {
      console.log("Your ID:", socket.id);
    });

    function sendMessage() {
      const to = document.getElementById("to").value;
      const message = document.getElementById("msg").value;
      socket.emit("send_message", { to, message });
      addMessage("You: " + message);
    }

    function addMessage(text) {
      const li = document.createElement("li");
      li.textContent = text;
      li.dataset.temp = "true";
      chat.appendChild(li);
    }

    socket.on("clear_sent", () => {
      document.querySelectorAll('[data-temp="true"]').forEach(el => el.remove());
    });

    socket.on("receive_message", ({ from, message }) => {
      const li = document.createElement("li");
      li.textContent = "From " + from + ": " + message;
      chat.appendChild(li);

      // Notify server that message was seen
      socket.emit("message_seen", { from });
    });

    socket.on("clear_received", ({ from }) => {
      const msgs = [...chat.children];
      msgs.forEach((li) => {
        if (li.textContent.startsWith("From " + from + ":")) {
          li.remove();
        }
      });
    });
  </script>
</body>
</html>
