// ----------------------------------
// Header.tsx - Component for the header section of the application
// ----------------------------------

// Importing resources
import "../stylesheets/Header.css";
import { Link, useLocation } from "react-router-dom";

// Main function for the Header component
export default function Header() {
    const location = useLocation();

    // Class and Opacity for the Logo and FavButton based on the location
    const logoId = location.pathname === "/favorites" ? "logoFav" : "logo";
    const favButtonStyles = location.pathname === "/favorites" ? { opacity: 0 } : {};

    // Rendering the Header section
    return (
        <div id="headerDiv">
            <Link to="/">
                {location.pathname === "/favorites" ? <div id="logoBackPlayButton">▶</div> : <div id="logoBackPlayButtonOut">▶</div>}
                <p id={logoId}>
                    tuneflu<span>x</span>
                </p>
            </Link>
            <Link to="/favorites" className="favButton" style={favButtonStyles}>
                ♡
            </Link>
        </div>
    );
}
