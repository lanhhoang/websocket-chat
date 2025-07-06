import { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

const ConversationPage = ({ match, socket }) => {
  const { id: conversationId } = match.params;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const sendMessage = () => {};

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", JSON.stringify(payload, null, 2));
      const { userId, email } = payload;
      setUserId(userId);
      setEmail(email);
    }
    if (socket) {
      socket.emit("create-conversation", { conversationId });
      socket.on("conversation-created", (data) => {
        console.log("Conversation created:", data);
      });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("join-conversation", { conversationId, userId, email });
      socket.on("get-users", ({ conversationId, users }) => {
        console.log(
          `Users in conversation ${conversationId}:`,
          JSON.stringify(users, null, 2)
        );
      });
      socket.on("conversation-joined", ({ conversationId }) => {
        console.log(`User joined conversation ${conversationId}`);
      });
    }
  }, [userId, email]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Conversation {conversationId}</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ConversationPage);
