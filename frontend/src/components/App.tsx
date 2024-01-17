// ----------------------------------
// App.tsx - Hauptkomponente der Anwendung
// ----------------------------------

// Import von Modulen und Komponenten
import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import {useEffect, useState} from 'react';
import RadioStation from '../models/RadioStation.ts';
import AudioPlayer from "./AudioPlayer.tsx";
import AppUser from "../models/AppUser.ts";
import { functions } from "../assets/functions.ts"

// Hauptfunktion für die App-Komponente
function App() {
    // Zustände für die App-Komponente
    const [playerVisibilityClass, setPlayerVisibilityClass] = useState<string>("playerNotVisible");
    const [isPlaying, setIsPlaying] = useState(false);
    const [actualStation, setActualStation] = useState<RadioStation>();
    const [mainPlayLoadingSpinnerVisible, setMainPlayLoadingSpinnerVisible] = useState<boolean>(false);
    const [appUser, setAppUser] = useState<AppUser | undefined | null>(undefined)

    useEffect(() => {
        functions.getMe(setAppUser);
    }, [])

    // Rendern der App-Komponente
    return (
        <>
            {/* Header-Komponente für den oberen Teil der Anwendung */}
            <Header/>
            {/* List-Komponente für die Anzeige der Radiostationen */}
            <List
                setActualStation={setActualStation}
                setIsPlaying={setIsPlaying}
                actualStation={actualStation}
            />
            {/* AudioPlayer-Komponente für die Steuerung des Radioplayers */}
            <AudioPlayer
                actualStation={actualStation}
                mainPlayLoadingSpinnerVisible={mainPlayLoadingSpinnerVisible}
                setMainPlayLoadingSpinnerVisible={setMainPlayLoadingSpinnerVisible}
                setPlayerVisibilityClass={setPlayerVisibilityClass}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playerVisibilityClass={playerVisibilityClass}
            />
            {/* Footer */}
            <div id="footer">
            { appUser ? (
                <>
                    <p>{appUser?.name}</p>
                    <button onClick={() => functions.logout(setAppUser)}>logout</button>
                </>
            ):
                <button onClick={functions.login}>login</button>
            }
            </div>

        </>
    );
}

// Export der App-Komponente für die Verwendung in anderen Dateien
export default App;
