
import "../stylesheets/List.css";
import RadioStation from "../models/RadioStation.ts";
import RadioStationItem from "./RadioStationItem.tsx";

type ListProps = {
    mainList: RadioStation[];
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>,
    straightPlay: () => void
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,

};

export default function List(props: Readonly<ListProps>) {
    return (
        <ul>
            {props.mainList.map((station) => (
                <RadioStationItem
                    key={station.stationuuid}
                    radioStation={station}
                    setActualStation={props.setActualStation}
                    setIsPlaying={props.setIsPlaying}
                />
            ))}
        </ul>
    );
}
