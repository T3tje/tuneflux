import RadioStation from "../models/RadioStation.ts";


type RadioStationItemProps = {
    radioStation: RadioStation
}
export default function RadioStationItem(props: Readonly<RadioStationItemProps>) {
    return(
            <li>{props.radioStation.name}</li>
    )
}