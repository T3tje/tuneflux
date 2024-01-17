import RadioStation from '../models/RadioStation.ts';
import axios from 'axios';
import {SetStateAction} from "react";
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

const getMe = async(setAppUser:React.Dispatch<SetStateAction<AppUser | undefined | null>>) => {
    axios.get("/api/me")
        .then(r => setAppUser(r.data))
        .catch(() => setAppUser(null))
}


export const functions = {
    fetchData,
    getMe
}