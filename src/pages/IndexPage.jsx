import { useEffect } from "react";

const IndexPage = (props) => {
  useEffect(() => {
    // Fetch initial chat messages or perform any setup
    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage:", token);

    if (token) {
      // User is authenticated, fetch chat messages
      console.log("User is authenticated, fetching chat messages...");
      props.history.push("/dashboard");
      return;
    } else {
      console.log("User is not authenticated, redirecting to login...");
      props.history.push("/login");
      return;
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the WebSocket Chat</h1>
    </div>
  );
};

export default IndexPage;
