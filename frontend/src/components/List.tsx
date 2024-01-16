// ----------------------------------
// List.tsx - Komponente für die Anzeige der Radiostationen
// ----------------------------------

// Import von Modulen und Komponenten
import React, { useEffect, useState } from "react";
import ListHeader from "./ListHeader.tsx";
import RadioStationItem from "./RadioStationItem.tsx";
import { functions } from "../assets/functions.ts";
import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/List.css";

// Typendefinition für die Props der List-Komponente
type ListProps = {
    setActualStation: React.Dispatch<React.SetStateAction<RadioStation | undefined>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    actualStation: RadioStation | undefined;
};

// Hauptfunktion für die List-Komponente
export default function List(props: Readonly<ListProps>) {
    // Zustände für die List-Komponente
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    const [marginBottom, setMarginBottom] = useState<string>("");
    const [searchDone, setSearchDone] = useState<boolean>(false)
    const [listAmountNumber, setListAmountNumber] = useState<number>(11);
    const [searchInput, setSearchInput] = useState("")

    // Effekt für das Laden der Radiostationen beim Start
    useEffect(() => {
        functions.fetchData("", 11, setMainList, setSearchDone)
    }, []);

    // Effekt für die Anpassung des Seitenabstands, wenn eine Radiostation ausgewählt ist
    useEffect(() => {
        if (props.actualStation) {
            setMarginBottom("150px");
        }
    }, [props.actualStation]);

    // Funktion zum Erhöhen der Anzahl der angezeigten Radiostationen
    const increaseList = () => {
        const increaseBy = 11;
        const newNumberOfStations = listAmountNumber + increaseBy;
        setListAmountNumber(newNumberOfStations);
        functions.fetchData(searchInput, newNumberOfStations, setMainList, setSearchDone)
    };

    // Rendern der List-Komponente
    return (
        <div className="listDiv" style={{ marginBottom: marginBottom }}>
            {searchDone ? (
                <>
                    {/* Header-Komponente für die Suche und Filterung der Radiostationen */}
                    <ListHeader
                        setSearchInput={setSearchInput}
                        searchInput={searchInput}
                        setListAmountNumber={setListAmountNumber}
                        setMainList={setMainList}
                        setSearchDone={setSearchDone}
                    />
                    {mainList.length === 0 ? (
                        // Meldung, wenn keine Radiostationen gefunden wurden
                        <div className="noStationsFoundMsgDiv">
                            <p>No radio stations were found with the selected search options.</p>
                        </div>
                    ) : (
                        // Anzeige der Radiostationen und Schaltfläche zum Laden weiterer Stationen
                        <>
                            <ul>
                                {mainList.map((station) => (
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
                // Ladeanimation während des Ladens der Radiostationen
                <div className="wholeScreenloader">
                    <div className="loading-spinner middleLoadingSpinner"></div>
                </div>
            )}
        </div>
    );
}

