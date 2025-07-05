import { useEffect } from "react";

const IndexPage = (props) => {
  useEffect(() => {
    // Fetch initial chat messages or perform any setup
    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage:", token);

    if (token) {
      // User is authenticated, fetch chat messages
      console.log("User is authenticated, fetching chat messages...");
    } else {
      // User is not authenticated, redirect to login
      console.log("User is not authenticated, redirecting to login...");
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the WebSocket Chat</h1>
    </div>
  );
};

export default IndexPage;
