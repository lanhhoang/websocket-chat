import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import makeToast from "../Toaster";

const SocketContext = createContext();

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !socket) {
      const token = localStorage.getItem("authToken");

      const newSocket = io("http://localhost:3000/chat", {
        transports: ["websocket"],
        auth: {
          token, // Send token for authentication
        },
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
        makeToast("error", "Disconnected from the server");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        makeToast("error", "Failed to connect to server");
      });

      setSocket(newSocket);
    }

    // Cleanup on unmount or when auth changes
    return () => {
      if (socket && !isAuthenticated) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [isAuthenticated, socket]);

  // Function to trigger authentication (call after login)
  const authenticate = () => {
    setIsAuthenticated(true);
  };

  // Function to logout and disconnect socket
  const logout = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  const value = {
    socket,
    isAuthenticated,
    authenticate,
    logout,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
