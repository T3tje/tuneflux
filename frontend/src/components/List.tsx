import "../stylesheets/List.css";
import RadioStation from "../models/RadioStation.ts";
import RadioStationItem from "./RadioStationItem.tsx";
import { useEffect, useState } from "react";
import ListHeader from "./ListHeader.tsx";

type ListProps = {
    mainList: RadioStation[];
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setListAmountNumber: React.Dispatch<React.SetStateAction<number>>;
    listAmountNumber: number;
    actualStation: RadioStation | undefined;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    searchInput: string,
    fetchData: (actualSearchInput:string, numberOfStations:number) => void,
    searchDone: boolean

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
        const newNumberOfStations = props.listAmountNumber + increaseBy;
        props.setListAmountNumber(newNumberOfStations);
        props.fetchData(props.searchInput, newNumberOfStations)
    };

    return (
        <div className="listDiv" style={{ marginBottom: marginBottom }}>
            {props.searchDone ? (
                <>
                    <ListHeader
                        setSearchInput={props.setSearchInput}
                        searchInput={props.searchInput}
                        fetchData={props.fetchData}
                        setListAmountNumber={props.setListAmountNumber}

                    />
                    {props.mainList.length === 0 ? (
                        <div className="noStationsFoundMsgDiv">
                            <p>
                                No radio stations were found with the selected search options.
                            </p>
                        </div>
                    ) : (
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
                    )}
                </>
            ) : (
                <div className="wholeScreenloader">
                    <div className="loading-spinner middleLoadingSpinner"></div>
                </div>
            )}
        </div>
    );
}
