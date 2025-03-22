import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/")}>🏠 Home</button>
      <button onClick={() => navigate("/profile")}>👤 Profile</button>
      <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
    </div>
  );
};

export default Sidebar;
