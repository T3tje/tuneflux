// ----------------------------------
// List.tsx - Komponente für die Anzeige der Radiostationen
// ----------------------------------

// Import von Modulen und Komponenten
import React, {SetStateAction, useEffect} from "react";
import ListHeader from "./ListHeader.tsx";
import RadioStationItem from "./RadioStationItem.tsx";
import RadioStation from "../models/RadioStation.ts";
import "../stylesheets/List.css";
import AppUser from "../models/AppUser.ts";
import {functions} from "../assets/functions.ts";
import {Navigate} from "react-router-dom";

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
    listTopic:string,
    appUser: AppUser | null | undefined,
    setAppUser:React.Dispatch<SetStateAction<AppUser | undefined | null>>,
    fromFavList: boolean,
    setSelectedCountry: React.Dispatch<SetStateAction<string>>,
    selectedCountry: string,
    selectedGenre: string,
    setSelectedGenre: React.Dispatch<SetStateAction<string>>,
    selectedSort:string,
    setSelectedSort: React.Dispatch<SetStateAction<string>>
};

// Hauptfunktion für die List-Komponente
export default function List(props: Readonly<ListProps>) {

    // Effekt für die Anpassung des Seitenabstands, wenn eine Radiostation ausgewählt ist
    useEffect(() => {
        if (props.actualStation) {
            props.setMarginListBottom("150px");
        }
    }, [props.actualStation]);

    // Wenn appUser nicht vorhanden ist und gerade in Fav List, zur "/login"-Seite navigieren
    if (!props.appUser && props.fromFavList) {
        return <Navigate to="/login" />;
    }

    // Rendern der List-Komponente
    return (
        <div className="listDiv" style={{ marginBottom: props.marginListBottom }}>
            {props.searchDone ? (
                <>
                    {/* Header-Komponente für die Suche und Filterung der Radiostationen */}
                    <ListHeader
                        setSearchInput={props.setSearchInput}
                        searchInput={props.searchInput}
                        setListAmountNumber={props.setListAmountNumber}
                        setList={props.setList}
                        setSearchDone={props.setSearchDone}
                        fromFavList={props.fromFavList}
                        appUser={props.appUser}
                        setSelectedCountry={props.setSelectedCountry}
                        selectedCountry={props.selectedCountry}
                        listAmountNumber={props.listAmountNumber}
                        selectedGenre={props.selectedGenre}
                        setSelectedGenre={props.setSelectedGenre}
                        selectedSort={props.selectedSort}
                        setSelectedSort={props.setSelectedSort}
                    />
                    {props.list.length === 0 ? (
                        // Meldung, wenn keine Radiostationen gefunden wurden
                        <div className="noStationsFoundMsgDiv">
                            <p>No radio stations were found with the selected search options {location.pathname === "/favorites" ? "or you dont have added a radiostation to your favorites. Please go back to MainList and add at least one radiostation" : null}. </p>
                        </div>
                    ) : (
                        // Anzeige der Radiostationen und Schaltfläche zum Laden weiterer Stationen
                        <>
                            <p className="listTopic">{props.listTopic}</p>
                            <ul>
                                {props.list.map((station) => (
                                    <RadioStationItem
                                        key={station.stationuuid}
                                        radioStation={station}
                                        setActualStation={props.setActualStation}
                                        setIsPlaying={props.setIsPlaying}
                                        location={location.pathname}
                                        appUser={props.appUser}
                                        setAppUser={props.setAppUser}
                                    />
                                ))}
                            </ul>
                            { // List Expand Button, Only if in MainList, else null
                                !props.fromFavList ?
                                    <button className="downArrowButton" onClick={
                                        () => functions.increaseList(
                                            props.listAmountNumber,
                                            props.setListAmountNumber,
                                            props.searchInput,
                                            props.setList,
                                            props.setSearchDone,
                                            props.fromFavList,
                                            props.selectedCountry,
                                            props.selectedGenre,
                                            props.selectedSort
                                        )
                                    }>
                                        ➧
                                    </button> :
                                        null
                            }
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

