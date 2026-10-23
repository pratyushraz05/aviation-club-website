import "./Navbar.css";
import { Link } from "react-router-dom";
import aviationLogo from "../../assets/aviation-logo.png";

function Navbar() {
  
  // This function tells the browser to smoothly scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="navbar">
      
      <div className="logo">
        {/* We added the onClick event right here! */}
        <Link to="/" className="logo-link" onClick={scrollToTop}>
          
          <img src={aviationLogo} alt="Aviation Club" className="nav-logo-img" />
          
          <div className="logo-text">
            ✈
            <br />
            Aviation
            <br />
            Club
          </div>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/team">Team</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/results">Results</Link></li> 
        <li><Link to="/contact">Contact & FeedBack</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;