import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const user = { name: "John Doe", email: "john.doe@example.com" }; // Replace with actual data

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button className="signout-btn" onClick={() => navigate("/")}>
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
