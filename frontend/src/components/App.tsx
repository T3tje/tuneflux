import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import RadioStation from '../models/RadioStation.ts';


function App() {
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    const [listAmountNumber, setListAmountNumber] = useState<number>(11);
    const [playerVisibilityClass, setPlayerVisibilityClass] = useState<string>("playerNotVisible")
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(37); // Anfangslautstärke auf 50 setzen
    const [actualStation, setActualStation] = useState<RadioStation>();
    const [mainPlayLoadingSpinnerVisible, setMainPlayLoadingSpinnerVisible] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState("")
    const [searchDone, setSearchDone] = useState<boolean>(false)
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTimeRef = useRef<number | null>(null);




    useEffect(() => {
        if (actualStation) {
            straightPlay();
        }
    }, [actualStation]);


    const fetchData = async (actualSearchInput:string, numberOfStations:number) => {
        try {
            const response = await axios.get(`/api/radio?limit=${numberOfStations}&reverse=true&order=votes&offset=0&tagList=&name=${actualSearchInput}&country=`);
            if (response.status === 200) {
                setMainList(response.data);
                setSearchDone(true);
            }


        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        }
    };

    useEffect(() => {
        fetchData("", 11)
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            // Lautstärke auf einen Wert zwischen 0 und 1 umrechnen
            audioElement.volume = volume / 100;
        }
    }, [volume]);

    const handleTimeUpdate = (audioElement: HTMLAudioElement | null) => {

        if (audioElement) {
            const currentTime = audioElement.currentTime;

            console.log('Aktuelle Zeit:', currentTime);

            // Vergleiche mit der vorherigen Zeit, wenn vorhanden
            if (currentTimeRef.current !== null) {
                console.log('Vergleich mit vorheriger Zeit:', currentTimeRef.current);

                console.log('mainPlayLoadingSpinnerVisible:', mainPlayLoadingSpinnerVisible);

                if (currentTimeRef.current === currentTime) {

                    if (!mainPlayLoadingSpinnerVisible) {
                        setMainPlayLoadingSpinnerVisible(true);
                    }
                } else {
                        setMainPlayLoadingSpinnerVisible(false);
                }

            }

            // Speichere die aktuelle Zeit für den nächsten Vergleich
            currentTimeRef.current = currentTime;
        }
    };

    useEffect(() => {
        const audioElement = audioRef.current;
        let timeUpdateHandler: () => void;

        if (audioElement) {
            timeUpdateHandler = () => handleTimeUpdate(audioElement);
            audioElement.addEventListener('timeupdate', timeUpdateHandler);
        }

        return () => {
            if (audioElement && timeUpdateHandler) {
                audioElement.removeEventListener('timeupdate', timeUpdateHandler);
            }
        };
    }, [audioRef]);

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

    const straightPlay = () => {
        const audioElement = audioRef.current
        if (audioElement) {
                audioElement.src = actualStation ? actualStation.url_resolved : "";
                setPlayerVisibilityClass("playerVisible")
            console.log("straightPlay()")
            console.log("actual Station", actualStation)
            setTimeout(() => {
                if (audioElement.played)
                setMainPlayLoadingSpinnerVisible(true);
            }, 10);
                audioElement.load()
                audioElement.play()
        }
    }

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };

    return (
        <>
            <Header/>
            <List
                mainList={mainList}
                setActualStation={setActualStation}
                setIsPlaying={setIsPlaying}
                setListAmountNumber={setListAmountNumber}
                listAmountNumber={listAmountNumber}
                actualStation={actualStation}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                fetchData={fetchData}
                searchDone={searchDone}
            />


            {/* Audioplayer */}

            <div id="audioPlayer" className={playerVisibilityClass}>

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
                        {
                            mainPlayLoadingSpinnerVisible ?
                                <div className="loading-spinner"></div> :
                                <button id="mainPlayButton" onClick={togglePlay}>
                                    {isPlaying ? <span id="mainPauseSpan">II</span> : <span>▶</span>}
                                </button>
                        }
                   </div>
                    <audio ref={audioRef} src={actualStation?.url_resolved}>
                        <track kind="captions" src="" label="Captions" />
                    </audio>
                    <div className="audioPlayerControlsContainer">
                        <button className="heartButton" id="mainPlayerHeart">♡</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;