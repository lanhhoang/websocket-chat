import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSocket } from "../contexts/ConversationContext";

import makeToast from "../Toaster";

const DashboardPage = () => {
  const [conversations, setConversations] = useState([]);
  const { logout } = useSocket();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  const getConversations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/conversations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Conversations response:", response);
      if (response.status === 200) {
        setConversations(response.data);
      } else {
        console.error("Failed to fetch conversations:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      makeToast(
        "error",
        error?.response?.data?.message ||
          "An error occurred while fetching conversations"
      );
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">
        <div>Conversations</div>
        <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      </div>
      <div className="chatrooms">
        {conversations.map((conversation) => (
          <div key={conversation._id} className="chatroom">
            <div>Conversation {conversation._id}</div>
            <Link to={"/conversations/" + conversation._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
