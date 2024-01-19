import RadioStation from '../models/RadioStation.ts';
import axios from 'axios';
import React, {SetStateAction} from "react";
import AppUser from "../models/AppUser.ts";
import PostDTO from "../models/PostDTO.ts";

// ============= FETCH MAIN LIST DATA / API ABFRAGE ============= //
const fetchData = async (actualSearchInput: string, numberOfStations: number, setMainList: React.Dispatch<React.SetStateAction<RadioStation[]>>, setSearchDone: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        const response = await axios.get(`/api/radio?limit=${numberOfStations}&reverse=true&order=votes&offset=0&tagList=&name=${actualSearchInput}&country=`);
        if (response.status === 200) {

            setMainList(response.data);
            setSearchDone(true);
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
};

// ============= TOGGLE RADIOSTATION TO OR OUT FAVORIT LIST ============= //
const toggleFavorite = async (
    radioStation: RadioStation,
    appUser: AppUser | null | undefined,
    setAppUser: React.Dispatch<React.SetStateAction<AppUser | undefined | null>>
): Promise<void> => {
    if (!appUser) {
        // Handle the case when appUser is not available (e.g., navigate to login)
        return;
    }

    // Proof if radiostation is favorite and save boolean to isFavorite variable
    const isFavorite: boolean = appUser.favoriteRadioStations.some(
        (station) => station.stationuuid === radioStation.stationuuid
    );

    if (isFavorite) {
        console.log("remove Item"); // NOCH ZU IMPLEMENTIEREN - DELETE REQUEST
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
const getMe = (setAppUser:React.Dispatch<SetStateAction<AppUser | undefined | null>>) => {
    axios.get("/api/me")
        .then(response => {
            if (response.status === 200) {
                setAppUser(response.data);
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
const logout = (setAppUser:React.Dispatch<SetStateAction<AppUser | undefined | null>>) => {
    setAppUser(null)
    window.open(host + "/logout", "_self")
}


// ============= EXPORT ============= //
export const functions = {
    fetchData,
    toggleFavorite,
    getMe,
    login,
    logout
}