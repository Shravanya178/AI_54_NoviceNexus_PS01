import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-info">
        <span>Name:</span>{" "}
        <strong>{auth.currentUser?.displayName || "Shravanya"}</strong>
      </div>
      <div className="profile-info">
        <span>Email: </span> <strong>{auth.currentUser?.email}</strong>
      </div>
      <div className="section">
        <a
          href="https://myaccount.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage Google Account
        </a>
        <p>Update your Google account details and preferences.</p>
      </div>
      <button className="signout-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
