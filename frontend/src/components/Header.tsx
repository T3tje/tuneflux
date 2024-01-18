// ----------------------------------
// Header.tsx - Komponente für den Kopfbereich der Anwendung
// ----------------------------------

// Import von Ressourcen
import "../stylesheets/Header.css";
import {Link} from "react-router-dom";

// Hauptfunktion für die Header-Komponente
export default function Header() {
    // Rendern des Header-Bereichs
    return (
        <div id="headerDiv">
            <Link to="/"> <p id="logo"><span>.</span>tuneflux</p></Link>
            <Link to="/favorites" className="favButton">♡</Link>
        </div>
    );
}