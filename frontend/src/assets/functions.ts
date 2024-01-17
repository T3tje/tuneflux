import RadioStation from '../models/RadioStation.ts';
import axios from 'axios';
import React, {SetStateAction} from "react";
import AppUser from "../models/AppUser.ts";

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

export const functions = {
    fetchData,
    getMe,
    login,
    logout
}