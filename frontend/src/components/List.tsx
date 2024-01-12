import "../stylesheets/List.css";
import RadioStation from "../models/RadioStation.ts";
import RadioStationItem from "./RadioStationItem.tsx";
import { useEffect, useState } from "react";

type ListProps = {
    mainList: RadioStation[];
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>;
    straightPlay: () => void;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setListAmountNumber: React.Dispatch<React.SetStateAction<number>>;
    listAmountNumber: number;
    actualStation: RadioStation | undefined;
};

export default function List(props: Readonly<ListProps>) {
    const [marginBottom, setMarginBottom] = useState<string>("");

    useEffect(() => {
        if (props.actualStation) {
            setMarginBottom("150px");
        }
    }, [props.actualStation]);

    const increaseList = () => {
        const increaseBy = 11;
        props.setListAmountNumber(props.listAmountNumber + increaseBy);
    };

    return (
        <div className="listDiv" style={{ marginBottom: marginBottom }}>
            {props.mainList.length > 0 ? (
                <>
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
                    <button className="downArrowButton" onClick={increaseList}>
                        ➧
                    </button>
                </>
            ) : (
                <div className="loading-spinner middleLoadingSpinner"></div>
            )}
        </div>
    );
}
