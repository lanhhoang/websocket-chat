import { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

const ConversationPage = ({ match, socket }) => {
  const { id: conversationId } = match.params;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");

  const sendMessage = () => {};

  useEffect(() => {
    if (socket) {
      socket.emit("create-conversation", { conversationId });
      socket.on("conversation-created", (data) => {
        console.log("Conversation created:", data);
      });
    }
  }, []);

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
