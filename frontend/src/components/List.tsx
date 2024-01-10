
import "../stylesheets/List.css";
import RadioStation from "../models/RadioStation.ts";
import RadioStationItem from "./RadioStationItem.tsx";

type ListProps = {
    mainList: RadioStation[];
};

export default function List(props: Readonly<ListProps>) {
    return (
        <ul>
            {props.mainList.map((station) => (
                <RadioStationItem key={station.stationuuid} radioStation={station}/>
            ))}
        </ul>
    );
}
