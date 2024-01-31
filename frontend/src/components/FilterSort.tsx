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

export default function FilterSort(props: FilterSortProps) {
    const [filterOpen, setFilterOpen] = useState<boolean>(false);

    const countryList = [  "Germany",
        "Austria",
        "Switzerland",
        "USA",
        "India",
        "Spain",
        "Italy",
        "Sweden",
        "Turkey",
        "South Africa",
    ]
    const toggleOpen = () => {
        setFilterOpen(!filterOpen);
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

        selectedCountry = props.selectedCountry;

        functions.fetchData(
            props.searchInput,
            props.listAmountNumber,
            props.setList,
            props.setSearchDone,
            selectedCountry
        );
    };

    const handleCountryButtonClick = (country: string) => {
        const newCountry =
            props.selectedCountry === country ? "" : country;
        props.setSelectedCountry(newCountry);
    };

    return (
        <>
            <div onClick={toggleOpen} className="filterTopic">
                Filter <span>/</span> Sort
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
                <button className="filterButton" onClick={handleFilterClick}>
                    Filtern
                </button>
            </div>
        </>
    );
}
