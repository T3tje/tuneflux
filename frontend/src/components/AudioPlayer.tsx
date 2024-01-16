
// ----------------------------------
// AudioPlayer.tsx - Komponente für die Steuerung des Radioplayers
// ----------------------------------

// Import von Modulen und Komponenten
import React, { useEffect, useRef, useState } from "react";
import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/AudioPlayer.css";

// Typendefinition für die Props der AudioPlayer-Komponente
type AudioPlayerProps = {
    actualStation: RadioStation | undefined,
    mainPlayLoadingSpinnerVisible: boolean,
    setMainPlayLoadingSpinnerVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setPlayerVisibilityClass: React.Dispatch<React.SetStateAction<string>>,
    isPlaying:boolean,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    playerVisibilityClass: string
}

// Hauptfunktion für die AudioPlayer-Komponente
export default function AudioPlayer(props:AudioPlayerProps) {
    // Zustände für die AudioPlayer-Komponente
    const [volume, setVolume] = useState(37); // Anfangslautstärke auf 50 setzen
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

    // Rendern der AudioPlayer-Komponente
    return(
        <div id="audioPlayer" className={props.playerVisibilityClass}>
            <p>{props.actualStation?.name}</p>
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
                    <button className="heartButton" id="mainPlayerHeart">♡</button>
                </div>
            </div>
        </div>
    )
}