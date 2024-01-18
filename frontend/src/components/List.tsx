// ----------------------------------
// List.tsx - Komponente für die Anzeige der Radiostationen
// ----------------------------------

// Import von Modulen und Komponenten
import React, {SetStateAction, useEffect, useState} from "react";
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
    list: RadioStation[],
    setList: React.Dispatch<SetStateAction<RadioStation[]>>,
    marginListBottom: string,
    setMarginListBottom: React.Dispatch<SetStateAction<string>>
    searchDone: boolean,
    setSearchDone: React.Dispatch<SetStateAction<boolean>>,
    listAmountNumber: number,
    setListAmountNumber: React.Dispatch<SetStateAction<number>>,
    searchInput: string,
    setSearchInput: React.Dispatch<SetStateAction<string>>,
    fetchData: (string,number,RadioStation[],boolean) => void

};

// Hauptfunktion für die List-Komponente
export default function List(props: Readonly<ListProps>) {

    // Effekt für das Laden der Radiostationen beim Start
    useEffect(() => {
        functions.fetchData("", 11, props.setList, props.setSearchDone)
    }, []);

    // Effekt für die Anpassung des Seitenabstands, wenn eine Radiostation ausgewählt ist
    useEffect(() => {
        if (props.actualStation) {
            props.setMarginListBottom("150px");
        }
    }, [props.actualStation]);

    // Funktion zum Erhöhen der Anzahl der angezeigten Radiostationen
    const increaseList = () => {
        const increaseBy = 11;
        const newNumberOfStations = props.listAmountNumber + increaseBy;
        props.setListAmountNumber(newNumberOfStations);
        functions.fetchData(searchInput, newNumberOfStations, props.setList, props.setSearchDone)
    };

    // Rendern der List-Komponente
    return (
        <div className="listDiv" style={{ marginBottom: props.marginListBottom }}>
            {props.searchDone ? (
                <>
                    {/* Header-Komponente für die Suche und Filterung der Radiostationen */}
                    <ListHeader
                        setSearchInput={setSearchInput}
                        searchInput={searchInput}
                        setListAmountNumber={props.setListAmountNumber}
                        setMainList={props.setList}
                        setSearchDone={props.setSearchDone}
                    />
                    {props.list.length === 0 ? (
                        // Meldung, wenn keine Radiostationen gefunden wurden
                        <div className="noStationsFoundMsgDiv">
                            <p>No radio stations were found with the selected search options.</p>
                        </div>
                    ) : (
                        // Anzeige der Radiostationen und Schaltfläche zum Laden weiterer Stationen
                        <>
                            <ul>
                                {props.list.map((station) => (
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

