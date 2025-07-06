import { useState, useEffect, useRef, useCallback } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import makeToast from "../Toaster";

import { useSocket } from "../contexts/ConversationContext";

const ConversationPage = ({ match }) => {
  const { id: conversationId } = match.params;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const { socket } = useSocket(); // Get socket from context

  const getMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", JSON.stringify(payload, null, 2));
      const { userId: currentUserId, email: currentUserEmail } = payload;
      setUserId(currentUserId);
      setEmail(currentUserEmail);

      const response = await axios.get(
        `http://localhost:3000/messages/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Messages response:", response);
      if (response.status === 200) {
        const messagesData = response.data.messages.map((msg) => {
          const { sender, recipient, content } = msg;

          // If the current user is the sender, show the message as from them
          // Otherwise, show it as from the other person
          const isCurrentUserSender = currentUserId === sender._id;

          return {
            userId: isCurrentUserSender ? sender._id : recipient._id,
            email: sender.email,
            content,
            isOwnMessage: isCurrentUserSender,
          };
        });
        setMessages(messagesData);
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      makeToast(
        "error",
        error?.response?.data?.message ||
          "An error occurred while fetching messages"
      );
    }
  }, [conversationId]);

  const sendMessage = () => {
    const content = messageRef.current.value;
    if (content.trim() && socket) {
      socket.emit("send-message", {
        conversationId,
        userId,
        email,
        content,
      });
      messageRef.current.value = "";
    }
  };

  const handleConversationCreated = ({ conversationId }) => {
    console.log("Conversation created:", conversationId);
  };

  const handleConversationSeen = ({ conversationId, userId, email }) => {
    console.log(
      `Conversation ${conversationId} seen by user ${email} (ID: ${userId})`
    );
  };

  const handleGetUsers = ({ conversationId, users }) => {
    console.log(
      `Users in conversation ${conversationId}:`,
      JSON.stringify(users, null, 2)
    );
  };

  const handleUserJoined = ({ userId, email }) => {
    console.log(`User joined: ${email} (ID: ${userId})`);
  };

  const handleUserLeft = ({ userId, email }) => {
    console.log(`User left: ${email} (ID: ${userId})`);
  };

  const handleConversationJoined = ({ conversationId }) => {
    console.log(`User joined conversation ${conversationId}`);
  };

  const handleConversationLeft = ({ conversationId }) => {
    console.log(`User left conversation ${conversationId}`);
  };

  const handleNewMessage = useCallback(
    ({ userId: messageUserId, email: messageEmail, content }) => {
      console.log(
        `New message from ${messageEmail} (ID: ${messageUserId}): ${content}`
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          userId: messageUserId,
          email: messageEmail,
          content,
          isOwnMessage: userId === messageUserId,
        },
      ]);
    },
    [userId]
  );

  useEffect(() => {
    getMessages();
  }, [conversationId, getMessages]);

  useEffect(() => {
    if (socket) {
      socket.emit("create-conversation", { conversationId });

      socket.on("conversation-created", handleConversationCreated);

      return () => {
        socket.off("conversation-created", handleConversationCreated);
      };
    }
  }, [conversationId, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("join-conversation", { conversationId, userId, email });
      socket.emit("seen-conversation", { conversationId, userId, email });

      socket.on("get-users", handleGetUsers);
      socket.on("user-joined", handleUserJoined);
      socket.on("conversation-joined", handleConversationJoined);
      socket.on("conversation-seen", handleConversationSeen);
      socket.on("new-message", handleNewMessage);
      socket.on("user-left", handleUserLeft);
      socket.on("conversation-left", handleConversationLeft);

      return () => {
        socket.off("get-users", handleGetUsers);
        socket.off("user-joined", handleUserJoined);
        socket.off("conversation-joined", handleConversationJoined);
        socket.off("conversation-seen", handleConversationSeen);
        socket.off("new-message", handleNewMessage);
        socket.off("user-left", handleUserLeft);
        socket.off("conversation-left", handleConversationLeft);
      };
    }
  }, [userId, email, conversationId, socket, handleNewMessage]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Conversation {conversationId}</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={message.isOwnMessage ? "ownMessage" : "otherMessage"}
              >
                {message.email}:
              </span>{" "}
              {message.content}
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
