// ----------------------------------
// App.tsx - Hauptkomponente der Anwendung
// ----------------------------------

// Import von Modulen und Komponenten
import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import { useState} from 'react';
import RadioStation from '../models/RadioStation.ts';
import AudioPlayer from "./AudioPlayer.tsx";

// Hauptfunktion für die App-Komponente
function App() {
    // Zustände für die App-Komponente
    const [playerVisibilityClass, setPlayerVisibilityClass] = useState<string>("playerNotVisible");
    const [isPlaying, setIsPlaying] = useState(false);
    const [actualStation, setActualStation] = useState<RadioStation>();
    const [mainPlayLoadingSpinnerVisible, setMainPlayLoadingSpinnerVisible] = useState<boolean>(false);

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
        </>
    );
}

// Export der App-Komponente für die Verwendung in anderen Dateien
export default App;
