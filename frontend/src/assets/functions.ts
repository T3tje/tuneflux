import RadioStation from '../models/RadioStation.ts';
import axios from 'axios';

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


export const functions = {
    fetchData
}