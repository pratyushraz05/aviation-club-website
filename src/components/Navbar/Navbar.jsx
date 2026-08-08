import "./Navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        ✈
        <br />
        Aviation
        <br />
        Club
      </div>

      <ul className="nav-links">
  <li><Link to="/">Home</Link></li>
  <li><Link to="/events">Events</Link></li>
  <li><Link to="/gallery">Gallery</Link></li>
  <li><Link to="/results">Results</Link></li>
  <li><Link to="/contact">Contact</Link></li>
</ul>
    </nav>
  );
}

export default Navbar;