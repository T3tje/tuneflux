// ----------------------------------
// ListHeader.tsx - Komponente für die Header-Leiste der Radiostationsliste
// ----------------------------------

// Import von Modulen und Ressourcen
import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/ListHeader.css";
import { functions } from "../assets/functions.ts";
import RadioStation from "../models/RadioStation.ts";

// Typendefinition für die Props der ListHeader-Komponente
type ListHeaderProps = {
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    searchInput: string;
    setListAmountNumber: React.Dispatch<React.SetStateAction<number>>;
    setMainList: React.Dispatch<React.SetStateAction<RadioStation[]>>;
    setSearchDone: React.Dispatch<React.SetStateAction<boolean>>;
}

// Hauptfunktion für die ListHeader-Komponente
export default function ListHeader(props: Readonly<ListHeaderProps>) {
    // Zustände für die ListHeader-Komponente
    const [searchOpen, setSearchOpen] = useState(true);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Effekt für das Fokussieren des Suchfelds bei Öffnen
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    // Funktion zum Umschalten des Suchfelds
    const toggleSeachInput = () => {
        setSearchOpen((searchOpen) => !searchOpen);
    }

    // Funktion für die Behandlung der Eingabe im Suchfeld
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchInput(event.target.value);
    }

    // Funktion für den X-Button zum Löschen der Suchanfrage
    const handleXButton = () => {
        props.setSearchInput("");
        //toggleSeachInput();
        functions.fetchData("", 11, props.setMainList, props.setSearchDone);
        props.setListAmountNumber(11);
    }

    // Funktion für die Behandlung des Tastendrucks im Suchfeld
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            functions.fetchData(props.searchInput, 11, props.setMainList, props.setSearchDone);
            props.setListAmountNumber(11);
        }
    }

    // Rendern der ListHeader-Komponente
    return (
        <div id="listHeaderDiv">
            {/* Text für den Filter- und Sortierbereich */}
            <div id="filterDiv">Filter / Sort</div>
            {/* Bedingte Anzeige des Suchfelds oder Lupenbuttons */}
            {searchOpen ?
                <div className="searchInputOuterDiv">
                    <input
                        type="text"
                        onChange={handleSearchInput}
                        value={props.searchInput}
                        placeholder="Search station by name..."
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

