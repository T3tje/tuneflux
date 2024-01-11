import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/RadioStationItem.css"


type RadioStationItemProps = {
    radioStation: RadioStation,
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
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
                <button className="heartButton">♡</button>
                <button onClick={handlePlayButton} className="playButton">▶</button>
            </div>
        </li>
    )
}