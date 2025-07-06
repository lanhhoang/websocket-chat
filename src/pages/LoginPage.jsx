import { createRef } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import makeToast from "../Toaster";

const LoginPage = (props) => {
  const emailRef = createRef();
  const passwordRef = createRef();

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      makeToast("error", "Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response);

      if (response.status === 200) {
        makeToast("success", "Login successful!");
        localStorage.setItem("authToken", response.data.token);
        props.history.push("/dashboard");
        props.setupSocket(); // Ensure socket is set up after login
      } else {
        makeToast("error", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);

      makeToast(
        "error",
        error?.response?.data?.message || "An error occurred while logging in"
      );
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
