import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import {useState, useEffect, useRef} from 'react';
import axios from 'axios'; // Stelle sicher, dass Axios installiert ist: npm install axios
import RadioStation from '../models/RadioStation.ts';


function App() {
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/radio');
                // Annahme: Die API-Antwort enthält ein Array von RadioStation-Objekten
                setMainList(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
    }, []); // Leerer Dependency Array, um sicherzustellen, dass der Effekt nur einmal bei der Montage aufgerufen wird

    const togglePlay = () => {
        const audioElement = audioRef.current;

        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }

            setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        }
    };

    return (
        <>
            <Header />
            <List mainList={mainList} />

            <div id="audioPlayer">
                <button id="playButton" onClick={togglePlay}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <audio ref={audioRef} src="http://stream.dancewave.online:8080/dance.mp3" />
            </div>

        </>
    );
}

export default App;
