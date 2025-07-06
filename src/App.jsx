import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ConversationPage from "./pages/ConversationPage";
import makeToast from "./Toaster";

import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    if (!socket) {
      const newSocket = io("http://localhost:3000/chat", {
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        makeToast(
          "success",
          `Connected to the server with ID: ${newSocket.id}`
        );
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocket(null);
        makeToast("error", "Disconnected from the server");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route
          path="/login"
          render={() => <LoginPage setupSocket={setupSocket} />}
        />
        <Route
          path="/dashboard"
          render={() => <DashboardPage socket={socket} />}
          exact
        />
        <Route
          path="/conversations/:id"
          render={() => <ConversationPage socket={socket} />}
          exact
        />
      </Switch>
    </Router>
  );
}

export default App;
