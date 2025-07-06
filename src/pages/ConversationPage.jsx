import { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { useSocket } from "../contexts/ConversationContext";

const ConversationPage = ({ match }) => {
  const { id: conversationId } = match.params;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const { socket } = useSocket(); // Get socket from context

  const sendMessage = () => {
    const message = messageRef.current.value;
    if (message.trim() && socket) {
      socket.emit("send-message", {
        conversationId,
        message,
        userId,
        email,
      });
      messageRef.current.value = "";
    }
  };

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

      const handleConversationCreated = (data) => {
        console.log("Conversation created:", data);
      };

      socket.on("conversation-created", handleConversationCreated);

      return () => {
        socket.off("conversation-created", handleConversationCreated);
      };
    }
  }, [conversationId, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("join-conversation", { conversationId, userId, email });

      const handleGetUsers = ({ conversationId, users }) => {
        console.log(
          `Users in conversation ${conversationId}:`,
          JSON.stringify(users, null, 2)
        );
      };

      const handleConversationJoined = ({ conversationId }) => {
        console.log(`User joined conversation ${conversationId}`);
      };

      const handleNewMessage = (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      };

      socket.on("get-users", handleGetUsers);
      socket.on("conversation-joined", handleConversationJoined);
      socket.on("new-message", handleNewMessage);

      return () => {
        socket.off("get-users", handleGetUsers);
        socket.off("conversation-joined", handleConversationJoined);
        socket.off("new-message", handleNewMessage);
      };
    }
  }, [userId, email, conversationId, socket]);

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
