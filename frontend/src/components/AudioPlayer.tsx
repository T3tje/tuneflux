
// ----------------------------------
// AudioPlayer.tsx - Komponente für die Steuerung des Radioplayers
// ----------------------------------

// Import von Modulen und Komponenten
import React, {SetStateAction, useEffect, useRef, useState} from "react";
import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/AudioPlayer.css";
import {functions} from "../assets/functions.ts";
import NullableAppUser from "../models/NullableAppUser.ts";

// Typendefinition für die Props der AudioPlayer-Komponente
type AudioPlayerProps = {
    actualStation: RadioStation | undefined,
    mainPlayLoadingSpinnerVisible: boolean,
    setMainPlayLoadingSpinnerVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setPlayerVisibilityClass: React.Dispatch<React.SetStateAction<string>>,
    isPlaying:boolean,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    playerVisibilityClass: string,
    appUser: NullableAppUser,
    setAppUser: React.Dispatch<SetStateAction<NullableAppUser>>
}

// Hauptfunktion für die AudioPlayer-Komponente
export default function AudioPlayer(props: Readonly<AudioPlayerProps>) {
    // Zustände für die AudioPlayer-Komponente
    const [volume, setVolume] = useState(30); // Anfangslautstärke auf 50 setzen
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTimeRef = useRef<number | null>(null);

    // Effekt für das Starten des Radios bei Änderung der ausgewählten Radiostation
    useEffect(() => {
        if (props.actualStation) {
            straightPlay(audioRef.current, props.actualStation);
        }
    }, [props.actualStation]);

    // Funktion für das Aktualisieren des Ladestatus während des Abspielens
    const handleTimeUpdate = (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            const currentTime = audioElement.currentTime;

            // Vergleiche mit der vorherigen Zeit, wenn vorhanden
            if (currentTimeRef.current !== null) {
                if (currentTimeRef.current === currentTime) {
                    if (!props.mainPlayLoadingSpinnerVisible) {
                        props.setMainPlayLoadingSpinnerVisible(true);
                    }
                } else {
                    props.setMainPlayLoadingSpinnerVisible(false);
                }
            }
            // Speichere die aktuelle Zeit für den nächsten Vergleich
            currentTimeRef.current = currentTime;
        }
    };

    // Effekt für das Hinzufügen und Entfernen des Timeupdate-Event-Handlers
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

    // Funktion für das direkte Abspielen einer Radiostation
    const straightPlay = (audioRefCurrent:HTMLAudioElement | null, actualStatiion:RadioStation ) => {
        if (audioRefCurrent) {
            audioRefCurrent.src = actualStatiion ? actualStatiion.url_resolved : "";
            props.setPlayerVisibilityClass("playerVisible")
            setTimeout(() => {
                if (audioRefCurrent.played)
                    props.setMainPlayLoadingSpinnerVisible(true);
            }, 10);
            audioRefCurrent.load()
            audioRefCurrent.play()
        }
    }

    // Funktion zum Starten oder Pausieren des Abspielens
    const togglePlay = () => {
        const audioElement = audioRef.current;

        if (audioElement) {
            if (props.isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }

            props.setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        }
    };

    // Funktion für die Anpassung der Lautstärke
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            // Lautstärke auf einen Wert zwischen 0 und 1 umrechnen
            audioElement.volume = volume / 100;
        }
    }, [volume]);

    // Rendern der AudioPlayer-Komponente
    return(
        <div id="audioPlayer" className={props.playerVisibilityClass}>
            <p>{props.actualStation?.name}</p>
            {/* Lautstärkeregler */}
            <div id="audioPlayerControls">

                <div className="audioPlayerControlsContainer">
                    <div id="volumeDiv">
                        <input
                            type="range"
                            value={volume}
                            onChange={handleVolumeChange}
                            min="0"
                            max="100"
                            step="1"
                        />
                        <div id="abschraegDiv"></div>
                        <div id="volumeStatus" style={{ width: `${volume * 0.7}px`}}></div>
                    </div>
                </div>

                {/* Abspiel-Button oder Pause-Button, abhängig vom Abspielstatus */}
                <div className="audioPlayerControlsContainer">
                    {
                        props.mainPlayLoadingSpinnerVisible ?
                            <div className="loading-spinner"></div> :
                            <button id="mainPlayButton" onClick={togglePlay}>
                                {props.isPlaying ? <span id="mainPauseSpan">II</span> : <span>▶</span>}
                            </button>
                    }
                </div>
                {/* Audio-Element für das Abspielen der Radiostation */}
                <audio ref={audioRef} src={props.actualStation?.url_resolved}>
                    <track kind="captions" src="" label="Captions" />
                </audio>
                {/* Button für das Markieren der Radiostation als Favorit */}
                <div className="audioPlayerControlsContainer">
                    <button
                        id="mainPlayerHeart"
                        className={
                            props.appUser?.favoriteRadioStations.some(station => station.stationuuid === (props.actualStation?.stationuuid)) ? 'heartButtonForFavorite' : 'heartButton'
                        }
                        onClick={() => props.actualStation && functions.toggleFavorite(props.actualStation, props.appUser, props.setAppUser)}
                        disabled={!props.actualStation}
                    >
                        ♡
                    </button>
                </div>

            </div>
        </div>
    )
}