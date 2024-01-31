// ----------------------------------
// ListHeader.tsx - Komponente für die Header-Leiste der Radiostationsliste
// ----------------------------------

// Import von Modulen und Ressourcen
import React, {SetStateAction, useEffect, useRef, useState} from "react";
import "../stylesheets/ListHeader.css";
import { functions } from "../assets/functions.ts";
import RadioStation from "../models/RadioStation.ts";
import NullableAppUser from "../models/NullableAppUser.ts";
import FilterSort from "./FilterSort.tsx";
import {useLocation} from "react-router-dom";

// Typendefinition für die Props der ListHeader-Komponente
type ListHeaderProps = {
    appUser: NullableAppUser,
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    searchInput: string;
    setListAmountNumber: React.Dispatch<React.SetStateAction<number>>;
    setList: React.Dispatch<React.SetStateAction<RadioStation[]>>;
    setSearchDone: React.Dispatch<React.SetStateAction<boolean>>;
    fromFavList: boolean,
    setSelectedCountry:React.Dispatch<SetStateAction<string>>
    selectedCountry:string,
    listAmountNumber:number,
    selectedGenre: string,
    setSelectedGenre:React.Dispatch<SetStateAction<string>>,
    selectedSort:string,
    setSelectedSort:React.Dispatch<SetStateAction<string>>
}

// Hauptfunktion für die ListHeader-Komponente
export default function ListHeader(props: Readonly<ListHeaderProps>) {
    // Zustände für die ListHeader-Komponente
    const [searchOpen, setSearchOpen] = useState(true);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const location = useLocation();

    // Effekt für das Fokussieren des Suchfelds bei Öffnen
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    //Fast filter if in Fav list
    useEffect(() => {
        if (props.fromFavList) {
            fastSearch();
        }
    }, [props.searchInput]);

    // Funktion zum Umschalten des Suchfelds - AKTUELL INVISIBLE
    const toggleSeachInput = () => {
        setSearchOpen((searchOpen) => !searchOpen);
    }

    //Search (Filter) Stations and put them to state // ONLY FOR FAV LIST
    const fastSearch = () => {
        props.setList(
            props.appUser
                ? props.appUser.favoriteRadioStations.filter(station =>
                    station.name.toLowerCase().includes(props.searchInput.toLowerCase()) //not case-sensitive
                )
                : [] // Empty list when appUser is not set
        );
    }

    // Funktion für die Behandlung der Eingabe im Suchfeld
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchInput(event.target.value);
    }

    // Funktion für den X-Button zum Löschen der Suchanfrage
    const handleXButton = () => {
        props.setSearchInput("");
        if (!props.fromFavList) {
            // if not in FavList fetchData from api
            functions.fetchData(
                "",
                20,
                props.setList,
                props.setSearchDone,
                "",
                props.selectedGenre,
                props.selectedSort
            );
        } else {
            // if in Fav List fill List with all Users Favorit stations
            props.setList(props.appUser ? props.appUser.favoriteRadioStations : []) // empty list when appUser is not set
        }
        props.setListAmountNumber(20);
    }

    // Funktion für die Behandlung des Tastendrucks im Suchfeld
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (!props.fromFavList) {
                // If not in the favorites list, fetch data
                functions.fetchData(
                    props.searchInput,
                    20,
                    props.setList,
                    props.setSearchDone,
                    props.selectedCountry,
                    props.selectedGenre,
                    props.selectedSort
                );
            } else {
                // Otherwise, filter the user's favorites and set it to the favList state
                fastSearch();
            }
            props.setListAmountNumber(20);
        }
    };



    // Rendern der ListHeader-Komponente
    return (
        <div id="listHeaderDiv">
            {/* Text für den Filter- und Sortierbereich */}
            <div
                className={location.pathname === "/favorites" ? "filterSortOut" : "filterSortVisible"}
            >
                <FilterSort
                    setSelectedCountry={props.setSelectedCountry}
                    selectedCountry={props.selectedCountry}
                    searchInput={props.searchInput}
                    listAmountNumber={props.listAmountNumber}
                    setList={props.setList}
                    setSearchDone={props.setSearchDone}
                    selectedGenre={props.selectedGenre}
                    setSelectedGenre={props.setSelectedGenre}
                    selectedSort={props.selectedSort}
                    setSelectedSort={props.setSelectedSort}

                />
            </div>

            {/* Bedingte Anzeige des Suchfelds oder Lupen buttons */}
            {searchOpen ?
                <div className="searchInputOuterDiv">
                    <input
                        type="text"
                        onChange={handleSearchInput}
                        value={props.searchInput}
                        placeholder="Search station..."
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                    />
                    <button className="searchInputDelX" onClick={handleXButton}><span>x</span></button>
                </div> :
                <button className="lupenButton" onClick={toggleSeachInput}>
                    <img
                        className="lupe" src="../../public/lupeNeu.png" alt="Search Icon"
                    />
                </button>
            }
        </div>
    );
}

