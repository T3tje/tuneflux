import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import RadioStation from '../models/RadioStation.ts';

function App() {
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50); // Anfangslautstärke auf 50 setzen
    const [actualStation, setActualStation] = useState<RadioStation>();
    const audioRef = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/radio');
                setMainList(response.data);
                setActualStation(response.data[0])
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            // Lautstärke auf einen Wert zwischen 0 und 1 umrechnen
            audioElement.volume = volume / 100;
        }
    }, [volume]);

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

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };

    return (
        <>
            <Header />
            <List mainList={mainList} />


            {/* Audioplayer */}

            <div id="audioPlayer">

                <p>{actualStation?.name}</p>
                <div id="audioPlayerControls">
                    {/* Lautstärkeregler */}
                    <div className="audioPlayerControlsContainer">
                        <input
                            type="range"
                            value={volume}
                            onChange={handleVolumeChange}
                            min="0"
                            max="100"
                            step="1"
                        />
                    </div>
                    <div className="audioPlayerControlsContainer">
                <button id="mainPlayButton" onClick={togglePlay}>
                    {isPlaying ? <span id="mainPauseSpan">II</span> : <span>▶</span>}
                </button>
                   </div>
                <audio ref={audioRef} src={actualStation?.url_resolved} />

                    <div className="audioPlayerControlsContainer">
                        <button className="heartButton" id="mainPlayerHeart">♡</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;