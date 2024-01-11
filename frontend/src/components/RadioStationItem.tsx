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
                {props.radioStation.name ?
                    <button className="heartButton emptyHeart">♡</button> :
                    <button className="heartButton fullHeart">♥</button>
                }
                <button className="playButton">▶</button>
            </div>
        </li>


    )
}