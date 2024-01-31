import "../stylesheets/FilterSort.css";
import React, { SetStateAction, useState } from "react";
import { functions } from "../assets/functions.ts";
import RadioStation from "../models/RadioStation.ts";
import storage from "../assets/storage.ts"

type FilterSortProps = {
    setSelectedCountry: React.Dispatch<SetStateAction<string>>;
    selectedCountry: string;
    searchInput: string;
    listAmountNumber: number;
    setList: React.Dispatch<SetStateAction<RadioStation[]>>;
    setSearchDone: React.Dispatch<React.SetStateAction<boolean>>,
    selectedGenre:string,
    setSelectedGenre: React.Dispatch<SetStateAction<string>>,
    selectedSort:string,
    setSelectedSort:React.Dispatch<SetStateAction<string>>
};

export default function FilterSort(props: Readonly<FilterSortProps>) {
    const [filterOpen, setFilterOpen] = useState<boolean>(false);



    const toggleOpen = () => {
        if (filterOpen) {
        setFilterOpen(false);
        } else {
            setFilterOpen(true)
        }
    };

    // Die Funktion wird aufgerufen, wenn der Filter-Button geklickt wird
    const handleFilterClick = () => {
        let selectedCountry;

        // Überprüfen, welches Land ausgewählt ist und den vollständigen Namen zuweisen
        if (props.selectedCountry === "USA") {
            selectedCountry = "The United States Of America";
        } else if (props.selectedCountry === "UK") {
            selectedCountry = "The United Kingdom Of Great Britain And Northern Ireland";
        } else if (props.selectedCountry === "Russia") {
            selectedCountry = "The Russian Federation";
        } else {
            // Wenn kein spezifisches Land ausgewählt ist, bleibt es unverändert
            selectedCountry = props.selectedCountry;
        }

        // Funktion fetchData wird aufgerufen, um Daten basierend auf den ausgewählten Parametern abzurufen
        functions.fetchData(
            props.searchInput,      // Sucheingabe
            props.listAmountNumber, // Anzahl der zu ladenden Elemente
            props.setList,          // Funktion zum Setzen der geladenen Datenliste
            props.setSearchDone,    // Funktion zum Setzen des Suchstatus
            selectedCountry,        // Ausgewähltes Land
            props.selectedGenre,    // Ausgewähltes Genre
            props.selectedSort      // Ausgewählte Sortierung
        );

        // Zustand filterOpen wird umgekehrt (true wird zu false, false wird zu true)
        setFilterOpen(!filterOpen);
    };


    const handleResetButton = () => {
        props.setSelectedCountry("")
        props.setSelectedGenre("")
        props.setSelectedSort("votes")
        functions.fetchData(
            props.searchInput,
            props.listAmountNumber,
            props.setList,
            props.setSearchDone,
            "",
            "",
            "votes"
        );
    }

    const handleCountryButtonClick = (country: string) => {
        const newCountry =
            props.selectedCountry === country ? "" : country;
        props.setSelectedCountry(newCountry);
    };

    const handleGenreButtonClick = (genre: string) => {
        const newGenre =
            props.selectedGenre === genre ? "" : genre;
        props.setSelectedGenre(newGenre);
    };

    const handleSortButtonClick = (sort: string) => {
        const newSort =
            props.selectedSort === sort ? "" : sort;
        props.setSelectedSort(newSort);
    };

    return (
        <>
            <div className="filterTopLeftDiv">
                <button onClick={toggleOpen} className="filterTopic">
                    Filter
                </button>
                {
                    props.selectedCountry !== "" || props.selectedGenre !== "" || props.selectedSort !== "votes" ? //X Button nur anzeigen, wenn kein Filter gesetzt
                        <button className="delFilterButton fade-button" onClick={handleResetButton}>x</button> :
                        null
                }
            </div>
                <div
                className={
                    filterOpen
                        ? "filterFensterOpen filterFenster"
                        : "filterFensterClosed filterFenster"
                }
            >
                <div className="filterFensterHeader">
                    <h3>Filter station search</h3>
                    <button
                        className="searchInputDelXFenster"
                        onClick={toggleOpen}
                    >
                        <span>x</span>
                    </button>
                </div>

                    {/*BY COUNTRY*/}

                <p className="filterByTopic">by country</p>
                <div className="countryButtons">
                    <button
                        className={`countryButton ${
                            props.selectedCountry === "" ? "selected" : ""
                        } ${props.selectedCountry === "" ? "" : "disabled"}`}
                        onClick={() => handleCountryButtonClick("")}
                        disabled={props.selectedCountry === ""}
                    >
                        All
                    </button>
                    {storage.countryList.map((country:string) => (
                        <button
                            key={country}
                            className={`countryButton ${
                                props.selectedCountry === country ? "selected" : ""
                            } ${props.selectedCountry === country ? "" : "disabled"}`}
                            onClick={() => handleCountryButtonClick(country)}
                            disabled={props.selectedCountry === country}
                        >
                            {country}
                        </button>
                    ))}
                </div>

                    {/*BY GENRE*/}

                    <p className="filterByTopic">by genre</p>
                    <div className="countryButtons">
                        <button
                            className={`countryButton ${
                                props.selectedGenre === "" ? "selected" : ""
                            } ${props.selectedGenre === "" ? "" : "disabled"}`}
                            onClick={() => handleGenreButtonClick("")}
                            disabled={props.selectedGenre === ""}
                        >
                            All
                        </button>
                        {storage.genreList.map((genre:string) => (
                            <button
                                key={genre}
                                className={`countryButton ${
                                    props.selectedGenre === genre ? "selected" : ""
                                } ${props.selectedGenre === genre ? "" : "disabled"}`}
                                onClick={() => handleGenreButtonClick(genre)}
                                disabled={props.selectedGenre === genre}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>


                    {/*Sort By*/}

                    <p className="filterByTopic">sort by ▼</p>
                    <div className="countryButtons">
                        <button
                            className={`countryButton ${
                                props.selectedSort === "votes" ? "selected" : ""
                            } ${props.selectedSort === "" ? "" : "disabled"}`}
                            onClick={() => handleSortButtonClick("votes")}
                            disabled={props.selectedSort === ""}
                        >
                            votes
                        </button>
                        {storage.sortList.map((sort:string) => (
                            <button
                                key={sort}
                                className={`countryButton ${
                                    props.selectedSort === sort ? "selected" : ""
                                } ${props.selectedSort === sort ? "" : "disabled"}`}
                                onClick={() => handleSortButtonClick(sort)}
                                disabled={props.selectedSort === sort}
                            >
                                {sort}
                            </button>
                        ))}
                    </div>

                    {/*FOOTER / BUTTONS*/}

                <div className="filterFensterFooter">
                    <button onClick={handleResetButton} className="filterButton">
                        reset
                    </button>
                    <button className="filterButton" onClick={handleFilterClick}>
                        filter
                    </button>
                </div>

            </div>
        </>
    );
}
