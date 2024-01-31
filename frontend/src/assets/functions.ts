import RadioStation from '../models/RadioStation.ts';
import axios from 'axios';
import React, {SetStateAction} from "react";
import AppUser from "../models/AppUser.ts";
import PostDTO from "../models/PostDTO.ts";
import NullableAppUser from "../models/NullableAppUser.ts";

// ============= FETCH MAIN LIST DATA / API ABFRAGE ============= //
const fetchData = async (
    actualSearchInput: string,
    numberOfStations: number,
    setList: React.Dispatch<React.SetStateAction<RadioStation[]>>,
    setSearchDone: React.Dispatch<React.SetStateAction<boolean>>,
    selectedCountry: string,
    selectedGenre:string,
    selectedSort:string
    ) => {
    try {
        const response = await axios.get(`/api/radio?limit=${numberOfStations}&reverse=true&order=${selectedSort}&offset=0&tag=${selectedGenre}&name=${actualSearchInput}&country=${selectedCountry}`);
        if (response.status === 200) {

            setList(response.data);
            setSearchDone(true);
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
};


// Funktion zum Erhöhen der Anzahl der angezeigten Radiostationen
const increaseList = (
    listAmountNumber:number,
    setListAmountNumber: React.Dispatch<SetStateAction<number>>,
    searchInput: string,
    setList: React.Dispatch<SetStateAction<RadioStation[]>>,
    setSearchDone: React.Dispatch<SetStateAction<boolean>>,
    fromFavList:boolean,
    selectedCountry: string,
    selectedGenre:string,
    selectedSort:string
) => {
    const increaseBy = 20;
    const newNumberOfStations = listAmountNumber + increaseBy;
    setListAmountNumber(newNumberOfStations);
    if (!fromFavList) {
        fetchData(searchInput, newNumberOfStations, setList, setSearchDone, selectedCountry, selectedGenre, selectedSort)
    }

};

// ============= TOGGLE RADIOSTATION TO OR OUT FAVORIT LIST ============= //
const toggleFavorite = async (
    radioStation: RadioStation,
    appUser: NullableAppUser,
    setAppUser: React.Dispatch<React.SetStateAction<NullableAppUser>>
): Promise<void> => {
    if (!appUser) {
        // Handle the case when appUser is not available (e.g., navigate to log in)
        const loginUrl = `${window.location.protocol}//${window.location.host}/login`;
        window.open(loginUrl, "_self");
        return;
    }

    // Proof if radiostation is favorite and save boolean to isFavorite variable
    const isFavorite: boolean = appUser.favoriteRadioStations.some(
        (station) => station.stationuuid === radioStation.stationuuid
    );

    if (isFavorite) {
        try {
            const postDTO: PostDTO = {
                userId: appUser.id,
                radioStation: radioStation,
            };

            // Send DELETE request to remove the radioStation from favorites
            await axios.delete("/api/radio", { data: postDTO });

            // Update the local state by removing the radioStation from the array
            const updatedFavoriteStations = appUser.favoriteRadioStations.filter(
                (station) => station.stationuuid !== radioStation.stationuuid
            );

            const updatedAppUser: AppUser = {
                ...appUser,
                favoriteRadioStations: updatedFavoriteStations,
            };

            setAppUser(updatedAppUser);

            console.log("RadioStation removed from favorites");
        } catch (error) {
            console.error("Error removing RadioStation from favorites:", error);
        }
    }

    if (!isFavorite) {
        // Kopiere das vorhandene Array und füge das neue Element am Anfang ein
        const newRadiostations: RadioStation[] = [
            radioStation,
            ...appUser.favoriteRadioStations,
        ];

        const updatedAppUser: AppUser = {
            ...appUser,
            favoriteRadioStations: newRadiostations,
        };

        setAppUser(updatedAppUser);

        const postDTO: PostDTO = {
            userId: appUser.id,
            radioStation: radioStation,
        };

        try {
            const response = await axios.post("/api/radio", postDTO);
            console.log("RadioStation added to favorites:", response.data);
        } catch (error) {
            console.error("Error adding RadioStation to favorites:", error);
        }
    }
};

// ============= AUTHENTICATION TEST REQUEST ============= //
const getMe = (setAppUser:React.Dispatch<SetStateAction<NullableAppUser>>) => {
    axios.get("/api/me")
        .then(response => {
            if (response.status === 200) {
                setAppUser(response.data); // SET USER TO STATE
            } else {
                setAppUser(null);
            }
        })
        .catch(() => setAppUser(null));
}



// ============= LOGIN / LOGOUT ============= //
const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin
//LOGIN
const login = () => {
    window.open(host + "/oauth2/authorization/github", "_self")
}

//LOGOUT
const logout = (setAppUser:React.Dispatch<SetStateAction<NullableAppUser>>) => {
    setAppUser(null)
    window.open(host + "/logout", "_self")
}

// ============= EXPORT ============= //
export const functions = {
    fetchData,
    toggleFavorite,
    getMe,
    login,
    logout,
    increaseList
}