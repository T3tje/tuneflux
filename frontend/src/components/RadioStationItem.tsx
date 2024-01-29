import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/RadioStationItem.css"
import { functions } from "../assets/functions.ts"
import React, {SetStateAction} from "react";
import AppUser from "../models/AppUser.ts";

type RadioStationItemProps = {
    radioStation: RadioStation,
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    location: string,
    appUser: AppUser | null | undefined,
    setAppUser:React.Dispatch<SetStateAction<AppUser | undefined | null>>,
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
                    className={
                        props.appUser?.favoriteRadioStations.some(station => station.stationuuid === props.radioStation.stationuuid) ? 'heartButtonForFavorite' : 'heartButton'
                    }
                    onClick={() => functions.toggleFavorite(props.radioStation, props.appUser, props.setAppUser)}
                >
                    ♡
                </button>
                <button onClick={handlePlayButton} className="playButton">▶</button>
            </div>
        </li>
    )
}