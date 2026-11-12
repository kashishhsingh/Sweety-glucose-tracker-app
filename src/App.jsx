
import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please wait...");

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setMessage("");
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
        setPassword("");
      }

    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMessage("");
    setEmail("");
    setPassword("");
  };

  if (token) {
    return (
      <Dashboard
        token={token}
        onLogout={logout}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">🌸 Sweety</div>

        <p className="subtitle">
          Your personal glucose tracking companion
        </p>

        <h1>
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h1>

        <p className="description">
          {isLogin
            ? "Log in to continue to your account."
            : "Sign up to start tracking your readings."}
        </p>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="message">{message}</p>
        )}

        <p className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default App;
