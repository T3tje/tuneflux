import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/RadioStationItem.css"


type RadioStationItemProps = {
    radioStation: RadioStation
}
export default function RadioStationItem(props: Readonly<RadioStationItemProps>) {

    return(
        <li className="stationListItem">
            <div>{props.radioStation.name}</div>
            <div className="buttonDiv">
                <button className="heartButton">♡</button>
                <button className="playButton">▶</button>
            </div>
        </li>
    )
}