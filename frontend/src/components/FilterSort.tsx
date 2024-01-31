import "../stylesheets/FilterSort.css";
import React, { SetStateAction, useState } from "react";
import { functions } from "../assets/functions.ts";
import RadioStation from "../models/RadioStation.ts";

type FilterSortProps = {
    setSelectedCountry: React.Dispatch<SetStateAction<string>>;
    selectedCountry: string;
    searchInput: string;
    listAmountNumber: number;
    setList: React.Dispatch<SetStateAction<RadioStation[]>>;
    setSearchDone: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FilterSort(props: Readonly<FilterSortProps>) {
    const [filterOpen, setFilterOpen] = useState<boolean>(false);

    const countryList = [
        "Argentina",
        "Australia",
        "Austria",
        "Brazil",
        "Canada",
        "China",
        "Germany",
        "Greece",
        "India",
        "Italy",
        "Japan",
        "Mexico",
        "Russia",
        "South Africa",
        "Spain",
        "Sweden",
        "Switzerland",
        "The Netherlands",
        "The Philippines",
        "Turkey",
        "UK",
        "USA"
    ]

    const toggleOpen = () => {
        setFilterOpen(!filterOpen);
        props.setSelectedCountry("")
    };

    const handleFilterClick = () =>  {

        let selectedCountry

        if (props.selectedCountry === "USA") {
            selectedCountry = "The United States Of America"
            functions.fetchData(
                props.searchInput,
                props.listAmountNumber,
                props.setList,
                props.setSearchDone,
                selectedCountry
            );
        }

        if (props.selectedCountry === "UK") {
            selectedCountry = "The United Kingdom Of Great Britain And Northern Ireland"
            functions.fetchData(
                props.searchInput,
                props.listAmountNumber,
                props.setList,
                props.setSearchDone,
                selectedCountry
            );
        }

        if (props.selectedCountry === "Russia") {
            selectedCountry = "TThe Russian Federation"
            functions.fetchData(
                props.searchInput,
                props.listAmountNumber,
                props.setList,
                props.setSearchDone,
                selectedCountry
            );
        }

        selectedCountry = props.selectedCountry;

        functions.fetchData(
            props.searchInput,
            props.listAmountNumber,
            props.setList,
            props.setSearchDone,
            selectedCountry
        );
        setFilterOpen(!filterOpen);
    };

    const handleResetButton = () => {
        props.setSelectedCountry("")
        functions.fetchData(
            props.searchInput,
            props.listAmountNumber,
            props.setList,
            props.setSearchDone,
            ""
        );
    }

    const handleCountryButtonClick = (country: string) => {
        const newCountry =
            props.selectedCountry === country ? "" : country;
        props.setSelectedCountry(newCountry);
    };

    return (
        <>
            <div className="filterTopLeftDiv">
                <button onClick={toggleOpen} className="filterTopic">
                    Filter <span>/</span> Sort
                </button>
                {
                    props.selectedCountry !== "" ?
                        <button className="delFilterButton fade-button" onClick={handleResetButton}>X</button> :
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
                    {countryList.map((country) => (
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
