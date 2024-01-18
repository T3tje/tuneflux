import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/RadioStationItem.css"
import { functions } from "../assets/functions.ts"
import React from "react";

type RadioStationItemProps = {
    radioStation: RadioStation,
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    location: string
}
export default function RadioStationItem(props: Readonly<RadioStationItemProps>) {

    const handlePlayButton = ():void  => {
        props.setActualStation(props.radioStation)
        props.setIsPlaying(true)
    }

    return(
        <li className="stationListItem">
            <div>{props.radioStation.name}</div>
            <div className="buttonDiv">
                <button
                    className="heartButton"
                    onClick={() => functions.toggleFavorite(props.location, props.radioStation)}
                >
                    ♡
                </button>
                <button onClick={handlePlayButton} className="playButton">▶</button>
            </div>
        </li>
    )
}