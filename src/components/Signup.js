import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Google Sign-Up Success:", result.user);
          navigate("/Home", { replace: true });
        }
      } catch (error) {
        console.error("Google Sign-Up Error:", error);
        setError(error.message);
      }
    };

    checkRedirectResult();
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up successfully!", userCredential.user);
      navigate("/Home", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-Up Success:", result.user);
      navigate("/Home", { replace: true });
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #1a1033, #2a1a4a)" }}
    >
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md signupcontainer"
        style={{
          backgroundColor: "rgba(35, 25, 66, 0.9)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ color: "#d4b6ff", padding: "20px" }}
        >
          NexusAI
        </h1>

        <h2
          className="text-xl font-semibold mb-6 text-center"
          style={{ color: "#d1b6ff" }}
        >
          Create an account
        </h2>

        {error && (
          <div
            className="border px-4 py-3 rounded mb-4"
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              borderColor: "rgba(220, 38, 38, 0.3)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="email"
              className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none input-field"
              style={{
                backgroundColor: "#f8f5ff",
                color: "#2a1a4a",
                borderColor: "#6b4dc3",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ID"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none input-field"
              style={{
                backgroundColor: "#f8f5ff",
                color: "#2a1a4a",
                borderColor: "#6b4dc3",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none input-field"
              style={{
                backgroundColor: "#f8f5ff",
                color: "#2a1a4a",
                borderColor: "#6b4dc3",
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            className="font-bold py-3 px-4 rounded w-full"
            style={{
              background: "linear-gradient(90deg, #5e35b1, #4527a0)",
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="relative flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="font-bold py-3 px-4 rounded w-full flex items-center justify-center transition-all google-login"
              style={{ color: "#333", position: "relative" }}
              disabled={loading}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="%2334A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="%23FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="%23EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  classname: "google-login",
                }}
              />
              <span>Sign up with Google</span>
            </button>
            <Link
              to="/"
              className="signup-link"
              style={{ color: "#b69dff", fontSize: 20 }}
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
